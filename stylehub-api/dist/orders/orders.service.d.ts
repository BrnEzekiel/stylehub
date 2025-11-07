import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { PdfGeneratorService } from './pdf-generator.service';
export declare class OrdersService {
    private prisma;
    private pdfService;
    constructor(prisma: PrismaService, pdfService: PdfGeneratorService);
    findOrdersByUserId(userId: string): Promise<Order[]>;
    findAllForSeller(sellerId: string): Promise<{
        orders: ({
            user: {
                name: string;
                email: string;
                id: string;
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
                platformFee: Prisma.Decimal;
                sellerEarning: Prisma.Decimal;
                orderId: string;
                productId: string | null;
                payoutId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: string;
            totalAmount: Prisma.Decimal;
            subtotal: Prisma.Decimal;
            shippingFee: Prisma.Decimal;
            shippingAddressId: string | null;
        })[];
        summary: {
            totalOrders: number;
            pendingOrders: number;
            totalRevenue: Prisma.Decimal;
        };
    }>;
    sellerUpdateOrderStatus(orderId: string, sellerId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        subtotal: Prisma.Decimal;
        shippingFee: Prisma.Decimal;
        shippingAddressId: string | null;
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
            platformFee: Prisma.Decimal;
            sellerEarning: Prisma.Decimal;
            orderId: string;
            productId: string | null;
            payoutId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        subtotal: Prisma.Decimal;
        shippingFee: Prisma.Decimal;
        shippingAddressId: string | null;
    })[]>;
    updateOrderStatus(orderId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        subtotal: Prisma.Decimal;
        shippingFee: Prisma.Decimal;
        shippingAddressId: string | null;
    }>;
    private findOrderForReceipt;
    downloadReceipt(orderId: string, userId: string, userRole: string): Promise<Buffer<ArrayBufferLike>>;
    findAdminOrderDetails(orderId: string): Promise<{
        user: {
            name: string;
            email: string;
            phone: string;
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
            platformFee: Prisma.Decimal;
            sellerEarning: Prisma.Decimal;
            orderId: string;
            productId: string | null;
            payoutId: string | null;
        })[];
        shippingAddress: {
            phone: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: Prisma.Decimal;
        subtotal: Prisma.Decimal;
        shippingFee: Prisma.Decimal;
        shippingAddressId: string | null;
    }>;
    adminDeleteOrder(orderId: string): Promise<{
        message: string;
    }>;
}
