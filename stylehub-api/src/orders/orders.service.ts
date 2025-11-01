// src/orders/orders.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Finds all orders for a specific CLIENT.
   */
  async findOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: { userId: userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error(`Error finding orders for user ${userId}:`, error);
      throw new InternalServerErrorException('Could not retrieve user orders.');
    }
  }

  /**
   * Finds all orders for a SELLER and calculates their summary.
   */
  async findAllForSeller(sellerId: string) {
    // ... (Your existing findAllForSeller method)
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: sellerId,
            },
          },
        },
      },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          where: {
            product: {
              sellerId: sellerId,
            },
          },
          include: {
            product: { select: { name: true, imageUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalRevenue = new Prisma.Decimal(0);
    let pendingOrders = 0;
    const totalOrders = orders.length;

    for (const order of orders) {
      if (order.status === 'pending') {
        pendingOrders++;
      }
      
      const sellerRevenueForThisOrder = order.items.reduce((acc, item) => {
        return acc.add(item.unitPrice.times(item.quantity));
      }, new Prisma.Decimal(0));
      
      totalRevenue = totalRevenue.add(sellerRevenueForThisOrder);
    }

    return {
      orders, 
      summary: {
        totalOrders,
        pendingOrders,
        totalRevenue,
      },
    };
  }

  /**
   * Finds all orders from all users for the admin.
   */
  async findAllAdmin() {
    // ... (Your existing findAllAdmin method)
    try {
      return await this.prisma.order.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error finding all orders for admin:', error);
      throw new InternalServerErrorException('Could not retrieve all orders.');
    }
  }

  /**
   * 🛑 NEW METHOD FOR ADMIN DASHBOARD 🛑
   * Admin updates the status of any order.
   */
   // 🛑 FIX: Changed type to 'string'
  async updateOrderStatus(orderId: string, status: string) {
    try {
      // 1. Check if the order exists
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }

      // 2. Update the order status
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: status }, // status is just a string
      });

      // 3. (Optional) In a real app, you would also:
      // - Send an email to the customer
      // - If status is 'cancelled', restock items

      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating order status:', error);
      throw new InternalServerErrorException('Could not update order status.');
    }
  }
}