import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { AdminUpdateProductDto } from './dto/admin-update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: any, file: any): Promise<{
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
        averageRating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, req: any): Promise<{
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
        averageRating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        products: {
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
            averageRating: import("@prisma/client/runtime/library").Decimal;
            reviewCount: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        seller: {
            name: string;
            email: string;
            id: string;
        };
    } & {
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
        averageRating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
    }>;
    findAllAdmin(): Promise<({
        seller: {
            name: string;
            email: string;
        };
    } & {
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
        averageRating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
    })[]>;
    adminCreate(createProductDto: CreateProductDto, file: any): Promise<{
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
        averageRating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
    }>;
    removeAdmin(id: string): Promise<{
        message: string;
    }>;
    adminUpdate(id: string, adminUpdateProductDto: AdminUpdateProductDto): Promise<{
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
        averageRating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
    }>;
}
