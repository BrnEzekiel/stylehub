import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { Prisma } from '@prisma/client';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCart;
    addItemToCart(userId: string, dto: AddItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        productId: string;
        cartId: string;
    }>;
    getCart(userId: string): Promise<{
        cart: {
            items: any[];
        };
        total: Prisma.Decimal;
    } | {
        cart: {
            items: ({
                product: {
                    name: string;
                    id: string;
                    price: Prisma.Decimal;
                    imageUrl: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                productId: string;
                cartId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
        total: Prisma.Decimal;
    }>;
    removeItem(userId: string, cartItemId: string): Promise<{
        message: string;
    }>;
    checkout(userId: string): Promise<{
        message: string;
        orderId: string;
        totalAmount: Prisma.Decimal;
    }>;
}
