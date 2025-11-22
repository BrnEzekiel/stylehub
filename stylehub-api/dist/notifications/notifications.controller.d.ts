import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<{
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
    getUnreadCount(req: any): Promise<number>;
    markAsRead(req: any, id: string): Promise<void>;
    markAllAsRead(req: any): Promise<void>;
}
