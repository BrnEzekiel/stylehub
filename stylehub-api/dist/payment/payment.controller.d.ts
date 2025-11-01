import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPaymentIntent(req: any, dto: CreatePaymentIntentDto): Promise<any>;
    confirmPayment(orderId: string, paymentId: string): Promise<{
        message: string;
        order: import(".prisma/client").Order;
    }>;
}
