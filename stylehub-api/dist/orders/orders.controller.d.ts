import { StreamableFile } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findClientOrders(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingFee: import("@prisma/client/runtime/library").Decimal;
        shippingAddressId: string | null;
    }[]>;
    findSellerOrders(req: any): Promise<{
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
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                quantity: number;
                platformFee: import("@prisma/client/runtime/library").Decimal;
                sellerEarning: import("@prisma/client/runtime/library").Decimal;
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
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            shippingFee: import("@prisma/client/runtime/library").Decimal;
            shippingAddressId: string | null;
        })[];
        summary: {
            totalOrders: number;
            pendingOrders: number;
            totalRevenue: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    updateSellerOrderStatus(req: any, id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingFee: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            sellerEarning: import("@prisma/client/runtime/library").Decimal;
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
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingFee: import("@prisma/client/runtime/library").Decimal;
        shippingAddressId: string | null;
    })[]>;
    findAdminOrderDetails(id: string): Promise<{
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            platformFee: import("@prisma/client/runtime/library").Decimal;
            sellerEarning: import("@prisma/client/runtime/library").Decimal;
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
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingFee: import("@prisma/client/runtime/library").Decimal;
        shippingAddressId: string | null;
    }>;
    updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingFee: import("@prisma/client/runtime/library").Decimal;
        shippingAddressId: string | null;
    }>;
    adminDeleteOrder(id: string): Promise<{
        message: string;
    }>;
    downloadReceipt(req: any, id: string, res: FastifyReply): Promise<StreamableFile>;
}
