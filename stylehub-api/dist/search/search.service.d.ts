import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    indexProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    reindexAllProducts(): Promise<void>;
    searchProducts(query: string): Promise<{
        results: {
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
        }[];
        totalHits: number;
    }>;
}
