"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const pdf_generator_service_1 = require("./pdf-generator.service");
const role_enum_1 = require("../auth/enums/role.enum");
let OrdersService = class OrdersService {
    constructor(prisma, pdfService) {
        this.prisma = prisma;
        this.pdfService = pdfService;
    }
    async findOrdersByUserId(userId) {
        try {
            return await this.prisma.order.findMany({
                where: { userId: userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, name: true, price: true, imageUrl: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            console.error(`Error finding orders for user ${userId}:`, error);
            throw new common_1.InternalServerErrorException('Could not retrieve user orders.');
        }
    }
    async findAllForSeller(sellerId) {
        const orders = await this.prisma.order.findMany({
            where: {
                items: {
                    some: { product: { sellerId: sellerId } },
                },
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: {
                    where: { product: { sellerId: sellerId } },
                    include: { product: { select: { name: true, imageUrl: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let totalRevenue = new client_1.Prisma.Decimal(0);
        let pendingOrders = 0;
        const totalOrders = orders.length;
        for (const order of orders) {
            if (order.status === 'pending' || order.status === 'paid') {
                pendingOrders++;
            }
            const sellerRevenueForThisOrder = order.items.reduce((acc, item) => {
                return acc.add(item.sellerEarning);
            }, new client_1.Prisma.Decimal(0));
            totalRevenue = totalRevenue.add(sellerRevenueForThisOrder);
        }
        return {
            orders,
            summary: { totalOrders, pendingOrders, totalRevenue },
        };
    }
    async sellerUpdateOrderStatus(orderId, sellerId, status) {
        try {
            const order = await this.prisma.order.findFirst({
                where: {
                    id: orderId,
                    items: {
                        some: {
                            product: {
                                sellerId: sellerId,
                            },
                        },
                    },
                },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found or you are not the seller.`);
            }
            const updatedOrder = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: status },
            });
            return updatedOrder;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Error updating order status by seller:', error);
            throw new common_1.InternalServerErrorException('Could not update order status.');
        }
    }
    async findAllAdmin() {
        try {
            return await this.prisma.order.findMany({
                include: {
                    user: {
                        select: { name: true, email: true },
                    },
                    items: {
                        include: {
                            product: { select: { name: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            console.error('Error finding all orders for admin:', error);
            throw new common_1.InternalServerErrorException('Could not retrieve all orders.');
        }
    }
    async updateOrderStatus(orderId, status) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found.`);
            }
            const updatedOrder = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: status },
            });
            return updatedOrder;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Error updating order status:', error);
            throw new common_1.InternalServerErrorException('Could not update order status.');
        }
    }
    async findOrderForReceipt(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: { name: true, email: true },
                },
                shippingAddress: true,
                items: {
                    select: {
                        productName: true,
                        quantity: true,
                        unitPrice: true,
                        product: {
                            select: { sellerId: true },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (!order.shippingAddress) {
            throw new common_1.NotFoundException('Shipping address not found for this order.');
        }
        return order;
    }
    async downloadReceipt(orderId, userId, userRole) {
        const order = await this.findOrderForReceipt(orderId);
        const isOwner = order.userId === userId;
        const isSeller = order.items.some((item) => item.product?.sellerId === userId);
        const isAdmin = userRole === role_enum_1.Role.Admin;
        if (!isOwner && !isSeller && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to view this receipt.');
        }
        try {
            const pdfBuffer = await this.pdfService.generateReceipt(order);
            return pdfBuffer;
        }
        catch (error) {
            console.error('Failed to generate PDF:', error);
            throw new common_1.InternalServerErrorException('Could not generate PDF receipt.');
        }
    }
    async findAdminOrderDetails(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: { name: true, email: true, phone: true }
                },
                shippingAddress: true,
                items: {
                    include: {
                        product: {
                            select: { name: true, imageUrl: true }
                        }
                    }
                }
            }
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found.`);
        }
        return order;
    }
    async adminDeleteOrder(orderId) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found.`);
            }
            await this.prisma.order.delete({
                where: { id: orderId },
            });
            return { message: 'Order and all related items deleted successfully.' };
        }
        catch (error) {
            console.error('Admin delete order error:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                throw new common_1.InternalServerErrorException('Database error: Foreign key constraint failed.');
            }
            throw new common_1.InternalServerErrorException('Could not delete order.');
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_generator_service_1.PdfGeneratorService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map