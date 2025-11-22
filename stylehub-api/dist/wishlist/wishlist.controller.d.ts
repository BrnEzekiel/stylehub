import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: any): Promise<({
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
    getWishlistProductIds(req: any): Promise<string[]>;
    addItem(req: any, productId: string): Promise<{
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
    removeItem(req: any, productId: string): Promise<{
        message: string;
    }>;
}
