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
    }[]>;
    findSellerOrders(req: any): Promise<{
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
                unitPrice: import("@prisma/client/runtime/library").Decimal;
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
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        })[];
        summary: {
            totalOrders: number;
            pendingOrders: number;
            totalRevenue: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
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
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
}
