import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleOrderPaid(order: Order): Promise<void>;
}
