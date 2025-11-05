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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WishlistService = class WishlistService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateWishlist(userId) {
        let wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist) {
            wishlist = await this.prisma.wishlist.create({
                data: { userId },
            });
        }
        return wishlist;
    }
    async getWishlist(userId) {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        return wishlist || { items: [] };
    }
    async addWishlistItem(userId, productId) {
        const wishlist = await this.getOrCreateWishlist(userId);
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingItem = await this.prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId: productId,
                },
            },
        });
        if (existingItem) {
            throw new common_1.ConflictException('Item is already in your wishlist');
        }
        return this.prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                productId: productId,
            },
            include: {
                product: true,
            },
        });
    }
    async removeWishlistItem(userId, productId) {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist) {
            throw new common_1.NotFoundException('Wishlist not found');
        }
        try {
            await this.prisma.wishlistItem.delete({
                where: {
                    wishlistId_productId: {
                        wishlistId: wishlist.id,
                        productId: productId,
                    },
                },
            });
            return { message: 'Item removed from wishlist' };
        }
        catch (error) {
            throw new common_1.NotFoundException('Item not found in wishlist');
        }
    }
    async getWishlistProductIds(userId) {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
            include: {
                items: {
                    select: {
                        productId: true,
                    },
                },
            },
        });
        if (!wishlist) {
            return [];
        }
        return wishlist.items.map(item => item.productId);
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map