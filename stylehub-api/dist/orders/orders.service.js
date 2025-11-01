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
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOrdersByUserId(userId) {
        try {
            return await this.prisma.order.findMany({
                where: { userId: userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    imageUrl: true,
                                },
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
                    some: {
                        product: {
                            sellerId: sellerId,
                        },
                    },
                },
            },
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    where: {
                        product: {
                            sellerId: sellerId,
                        },
                    },
                    include: {
                        product: { select: { name: true, imageUrl: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let totalRevenue = new client_1.Prisma.Decimal(0);
        let pendingOrders = 0;
        const totalOrders = orders.length;
        for (const order of orders) {
            if (order.status === 'pending') {
                pendingOrders++;
            }
            const sellerRevenueForThisOrder = order.items.reduce((acc, item) => {
                return acc.add(item.unitPrice.times(item.quantity));
            }, new client_1.Prisma.Decimal(0));
            totalRevenue = totalRevenue.add(sellerRevenueForThisOrder);
        }
        return {
            orders,
            summary: {
                totalOrders,
                pendingOrders,
                totalRevenue,
            },
        };
    }
    async findAllAdmin() {
        try {
            return await this.prisma.order.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: { name: true },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map