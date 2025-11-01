import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { Order } from '@prisma/client';
export declare class PaymentService {
    private prisma;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    createPaymentIntent(userId: string, dto: CreatePaymentIntentDto): Promise<any>;
    confirmPayment(orderId: string, paymentId: string): Promise<{
        message: string;
        order: Order;
    }>;
}
