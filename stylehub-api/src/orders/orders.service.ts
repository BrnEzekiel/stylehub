// src/orders/orders.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { PdfGeneratorService } from './pdf-generator.service';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfGeneratorService,
  ) {}

  async findOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: { userId: userId },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true, imageUrl: true },
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

  async findAllForSeller(sellerId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: { product: { sellerId: sellerId } },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          where: { product: { sellerId: sellerId } },
          include: { product: { select: { name: true, imageUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalRevenue = new Prisma.Decimal(0);
    let pendingOrders = 0;
    const totalOrders = orders.length;
    
    for (const order of orders) {
      if (order.status === 'pending' || order.status === 'paid') {
        pendingOrders++;
      }
      // Calculate revenue based on *sellerEarning* not unitPrice
      const sellerRevenueForThisOrder = order.items.reduce((acc, item) => {
        return acc.add(item.sellerEarning); // 🛑 Use sellerEarning
      }, new Prisma.Decimal(0));
      totalRevenue = totalRevenue.add(sellerRevenueForThisOrder);
    }
    
    return {
      orders,
      summary: { totalOrders, pendingOrders, totalRevenue },
    };
  }
  
  /**
   * 🛑 NEW: Seller updates status of an order
   */
  async sellerUpdateOrderStatus(orderId: string, sellerId: string, status: string) {
    try {
      // 1. Verify the order exists and this seller is part of it
      const order = await this.prisma.order.findFirst({
        where: {
          id: orderId,
          items: {
            some: {
              product: {
                sellerId: sellerId,
              },
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found or you are not the seller.`);
      }

      // 2. Update the order status
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: status },
      });
      
      // 3. (In real app, send notification to client)
      
      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating order status by seller:', error);
      throw new InternalServerErrorException('Could not update order status.');
    }
  }

  async findAllAdmin() {
    try {
      return await this.prisma.order.findMany({
        include: {
          user: {
            select: { name: true, email: true },
          },
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error finding all orders for admin:', error);
      throw new InternalServerErrorException('Could not retrieve all orders.');
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: status },
      });
      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating order status:', error);
      throw new InternalServerErrorException('Could not update order status.');
    }
  }

  private async findOrderForReceipt(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { name: true, email: true },
        },
        shippingAddress: true,
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPrice: true,
            product: {
              select: { sellerId: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (!order.shippingAddress) {
      throw new NotFoundException('Shipping address not found for this order.');
    }
    return order;
  }

  async downloadReceipt(orderId: string, userId: string, userRole: string) {
    const order = await this.findOrderForReceipt(orderId);
    const isOwner = order.userId === userId;
    const isSeller = order.items.some((item) => item.product?.sellerId === userId);
    const isAdmin = userRole === Role.Admin; 

    if (!isOwner && !isSeller && !isAdmin) {
      throw new ForbiddenException('You do not have permission to view this receipt.');
    }

    try {
      const pdfBuffer = await this.pdfService.generateReceipt(order);
      return pdfBuffer;
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw new InternalServerErrorException('Could not generate PDF receipt.');
    }
  }

  async findAdminOrderDetails(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        },
        shippingAddress: true,
        items: {
          include: {
            product: {
              select: { name: true, imageUrl: true }
            }
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    return order;
  }

  async adminDeleteOrder(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }
      await this.prisma.order.delete({
        where: { id: orderId },
      });

      return { message: 'Order and all related items deleted successfully.' };
    } catch (error) {
      console.error('Admin delete order error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new InternalServerErrorException('Database error: Foreign key constraint failed.');
      }
      throw new InternalServerErrorException('Could not delete order.');
    }
  }
}