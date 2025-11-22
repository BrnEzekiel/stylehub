import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAllForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        userId: string;
        orderId: string | null;
        type: string;
        title: string;
        isRead: boolean;
        readAt: Date | null;
    }[]>;
    getUnreadCountForUser(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        message: string;
        userId: string;
        orderId: string | null;
        type: string;
        title: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAllAsReadForUser(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    handleOrderPaid(order: Order): Promise<void>;
}
