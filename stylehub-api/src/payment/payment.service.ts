// src/payment/payment.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter'; // 1. Import EventEmitter2
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name); // Optional: for logging

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2, // 2. Inject EventEmitter2
  ) {}

  async createPaymentIntent(userId: string, dto: CreatePaymentIntentDto): Promise<any> {
    this.logger.log(`Creating payment intent for order ${dto.orderId} by user ${userId}`);
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId, userId: userId }, // Ensure user owns the order
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${dto.orderId} not found or does not belong to user.`);
      }

      if (order.status !== 'pending') {
          throw new InternalServerErrorException(`Order ${dto.orderId} is not pending, cannot create payment intent.`);
      }

      // --- Simulation Logic ---
      // In a real scenario, interact with Stripe/M-Pesa API here
      const amountInCents = Number(order.totalAmount) * 100; // Assuming KES, convert to cents
      const paymentIntentId = `simulated_pi_${Date.now()}`;
      const clientSecret = `simulated_secret_${order.id}`; // Include order ID for easy link
      // --- End Simulation ---

      this.logger.log(`Payment intent ${paymentIntentId} created for order ${dto.orderId}`);
      return {
        // Return details client might need
        orderId: order.id,
        amount: amountInCents, // Send amount in cents
        currency: 'kes',        // Assuming KES
        paymentId: paymentIntentId, // Our simulated ID
        clientSecret: clientSecret, // Our simulated secret
      };
    } catch (error) {
      this.logger.error(`Failed to create payment intent for order ${dto.orderId}:`, error);
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
          throw error;
      }
      throw new InternalServerErrorException('Could not create payment intent.');
    }
  }

  async confirmPayment(orderId: string, paymentId: string): Promise<{ message: string, order: Order }> {
     this.logger.log(`Confirming payment ${paymentId} for order ${orderId}`);
    // Basic validation (in real webhook, verify signature/event from provider)
    if (!orderId || !paymentId || !paymentId.startsWith('simulated_pi_')) {
        throw new InternalServerErrorException('Invalid confirmation data.');
    }

    try {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            throw new NotFoundException(`Order ${orderId} not found during payment confirmation.`);
        }

        if (order.status === 'paid') {
            this.logger.warn(`Order ${orderId} is already paid. Ignoring confirmation.`);
            return { message: "Order already marked as paid.", order };
        }

        if (order.status !== 'pending') {
            throw new InternalServerErrorException(`Order ${orderId} status is ${order.status}, cannot confirm payment.`);
        }

        // Update order status to 'paid'
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'paid' },
        });

        this.logger.log(`Order ${orderId} status updated to paid.`);

        // --- 3. Emit the 'order.paid' event ---
        this.eventEmitter.emit('order.paid', updatedOrder);
        this.logger.log(`Event 'order.paid' emitted for order ${orderId}`);
        // --- End Emit ---

        return {
            message: "Payment confirmed and order status updated. Notification enqueued.", // Updated message
            order: updatedOrder
        };

    } catch (error) {
        this.logger.error(`Failed to confirm payment for order ${orderId}:`, error);
         if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
          throw error;
        }
        throw new InternalServerErrorException('Could not confirm payment or update order.');
    }
  }
}