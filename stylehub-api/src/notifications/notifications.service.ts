// src/notifications/notifications.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client'; // 1. Import only Order

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // 2. Inject PrismaService
  constructor(private prisma: PrismaService) {}

  @OnEvent('order.paid', { async: true })
  async handleOrderPaid(order: Order) { // 3. Expect a plain Order object
    this.logger.log(`Received 'order.paid' event for Order ID: ${order.id}`);

    try {
      // 4. Get order details to find the seller
      const orderDetails = await this.prisma.order.findUnique({
        where: { id: order.id },
        include: {
          items: { // 5. 🛑 FIX: Include items
            include: {
              product: { // 6. 🛑 FIX: Include product
                select: {
                  sellerId: true, 
                },
              },
            },
          },
        },
      });

      if (!orderDetails || !orderDetails.items.length) {
        this.logger.warn(`Order ${order.id} not found or has no items. No notification created.`);
        return;
      }

      // --- Notify the SELLER of the sale ---
      // 7. 🛑 FIX: Access items/product correctly
      const sellerId = orderDetails.items[0].product.sellerId; 
      
      if (!sellerId) {
          this.logger.warn(`Order ${order.id} has no seller. No notification created.`);
          return;
      }

      const messageToSeller = `You have a new order (#${order.id.substring(0, 8)}) for $${order.totalAmount}.`;

      // 8. 🛑 FIX: Create the notification in the database
      const notification = await this.prisma.notification.create({
        data: {
          userId: sellerId,
          type: 'ORDER_PAID', // 9. 🛑 FIX: Use a plain string
          message: messageToSeller,
          orderId: order.id, // 10. 🛑 FIX: Save the orderId
        },
      });

      this.logger.log(`Notification ${notification.type} created for user ${sellerId}`);

    } catch (error) {
      this.logger.error(
        `Failed to handle 'order.paid' event for Order ID: ${order.id}`,
        error.stack,
      );
    }
  }
}