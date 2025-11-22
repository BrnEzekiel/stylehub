import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateWishlist;
    getWishlist(userId: string): Promise<({
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                stock: number;
                category: string | null;
                imageUrl: string | null;
                sellerId: string | null;
                isActive: boolean;
                averageRating: import("@prisma/client/runtime/library").Decimal;
                reviewCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }) | {
        items: any[];
    }>;
    addWishlistItem(userId: string, productId: string): Promise<{
        product: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            category: string | null;
            imageUrl: string | null;
            sellerId: string | null;
            isActive: boolean;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            reviewCount: number;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        wishlistId: string;
    }>;
    removeWishlistItem(userId: string, productId: string): Promise<{
        message: string;
    }>;
    getWishlistProductIds(userId: string): Promise<string[]>;
}
