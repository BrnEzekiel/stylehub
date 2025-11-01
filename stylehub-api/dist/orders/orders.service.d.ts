import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOrdersByUserId(userId: string): Promise<Order[]>;
    findAllForSeller(sellerId: string): Promise<{
        orders: ({
            user: {
                name: string;
                email: string;
            };
            items: ({
                product: {
                    name: string;
                    imageUrl: string;
                };
            } & {
                id: string;
                createdAt: Date;
                productName: string;
                unitPrice: Prisma.Decimal;
                quantity: number;
                orderId: string;
                productId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: string;
            totalAmount: Prisma.Decimal;
        })[];
        summary: {
            totalOrders: number;
            pendingOrders: number;
            totalRevenue: Prisma.Decimal;
        };
    }>;
    findAllAdmin(): Promise<({
        user: {
            name: string;
            email: string;
        };
        items: ({
            product: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productName: string;
            unitPrice: Prisma.Decimal;
            quantity: number;
            orderId: string;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: Prisma.Decimal;
    })[]>;
    updateOrderStatus(orderId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: Prisma.Decimal;
    }>;
}
