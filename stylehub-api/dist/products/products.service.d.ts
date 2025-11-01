import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { SearchService } from '../search/search.service';
import { StorageService } from '../storage/storage.service';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    private storageService;
    private searchService;
    constructor(prisma: PrismaService, storageService: StorageService, searchService: SearchService);
    create(data: CreateProductDto, sellerId: string, file: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        stock: number;
        category: string | null;
        imageUrl: string | null;
        sellerId: string | null;
        averageRating: Prisma.Decimal;
        reviewCount: number;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        products: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: Prisma.Decimal;
            stock: number;
            category: string | null;
            imageUrl: string | null;
            sellerId: string | null;
            averageRating: Prisma.Decimal;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        stock: number;
        category: string | null;
        imageUrl: string | null;
        sellerId: string | null;
        averageRating: Prisma.Decimal;
        reviewCount: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, sellerId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        stock: number;
        category: string | null;
        imageUrl: string | null;
        sellerId: string | null;
        averageRating: Prisma.Decimal;
        reviewCount: number;
    }>;
    remove(id: string, sellerId: string): Promise<{
        message: string;
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
        price: Prisma.Decimal;
        stock: number;
        category: string | null;
        imageUrl: string | null;
        sellerId: string | null;
        averageRating: Prisma.Decimal;
        reviewCount: number;
    })[]>;
    removeAdmin(id: string): Promise<{
        message: string;
    }>;
}
