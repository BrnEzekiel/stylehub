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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const PLATFORM_FEE_RATE = new client_1.Prisma.Decimal(0.10);
const SHIPPING_FEE = new client_1.Prisma.Decimal(200.00);
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
            });
        }
        return cart;
    }
    async addItemToCart(userId, dto) {
        const { productId, quantity } = dto;
        const cart = await this.getOrCreateCart(userId);
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new common_1.BadRequestException('Insufficient stock for updated quantity');
            }
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        }
        else {
            return this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: quantity,
                },
            });
        }
    }
    async getCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
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
        });
        const subtotal = cart?.items.reduce((acc, item) => {
            if (item.product && item.product.price) {
                return acc + item.product.price.toNumber() * item.quantity;
            }
            return acc;
        }, 0) || 0;
        const total = subtotal > 0 ? subtotal + SHIPPING_FEE.toNumber() : 0;
        return {
            cart: cart || { items: [] },
            subtotal: new client_1.Prisma.Decimal(subtotal),
            shippingFee: SHIPPING_FEE,
            total: new client_1.Prisma.Decimal(total),
        };
    }
    async removeItem(userId, cartItemId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.cart.userId !== userId) {
            throw new common_1.UnauthorizedException('This item does not belong to your cart');
        }
        await this.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
        return { message: 'Item removed successfully' };
    }
    async checkout(userId, dto) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, price: true, stock: true, sellerId: true },
                        },
                    },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cannot checkout an empty cart.');
        }
        let subtotal = new client_1.Prisma.Decimal(0);
        const orderItemsData = [];
        for (const item of cart.items) {
            if (!item.product) {
                throw new common_1.NotFoundException(`Product data missing for item in cart. Product may have been deleted.`);
            }
            if (item.product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Product "${item.product.name}" is out of stock.`);
            }
            const productPrice = item.product.price;
            const quantity = item.quantity;
            const itemSubtotal = productPrice.times(quantity);
            subtotal = subtotal.add(itemSubtotal);
            let itemPlatformFee = new client_1.Prisma.Decimal(0);
            let itemSellerEarning = new client_1.Prisma.Decimal(0);
            if (item.product.sellerId) {
                itemPlatformFee = itemSubtotal.times(PLATFORM_FEE_RATE).toDecimalPlaces(2);
                itemSellerEarning = itemSubtotal.minus(itemPlatformFee);
            }
            else {
                itemPlatformFee = itemSubtotal;
                itemSellerEarning = new client_1.Prisma.Decimal(0);
            }
            orderItemsData.push({
                productId: item.productId,
                productName: item.product.name,
                unitPrice: productPrice,
                quantity: quantity,
                platformFee: itemPlatformFee,
                sellerEarning: itemSellerEarning,
            });
        }
        const totalAmount = subtotal.add(SHIPPING_FEE);
        return this.prisma.$transaction(async (tx) => {
            const newAddress = await tx.address.create({
                data: {
                    userId: userId,
                    ...dto,
                },
            });
            const newOrder = await tx.order.create({
                data: {
                    userId: userId,
                    subtotal: subtotal,
                    shippingFee: SHIPPING_FEE,
                    totalAmount: totalAmount,
                    status: 'pending',
                    shippingAddressId: newAddress.id,
                    items: {
                        createMany: {
                            data: orderItemsData,
                        },
                    },
                },
            });
            const stockUpdates = cart.items.map((item) => tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            }));
            await Promise.all(stockUpdates);
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return {
                message: 'Order created. Proceed to payment.',
                orderId: newOrder.id,
                totalAmount: newOrder.totalAmount,
            };
        }, {
            timeout: 30000,
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map