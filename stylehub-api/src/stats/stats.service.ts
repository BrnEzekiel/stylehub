// src/stats/stats.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// 1. 🛑 FIX: Removed 'OrderStatus'
import { KycStatus } from '@prisma/client';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboardStats() {
    try {
      // 1. Get total revenue (sum of all 'paid', 'shipped', 'delivered' orders)
      const revenueData = await this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            // 2. 🛑 FIX: Use plain strings instead of the enum
            in: ['paid', 'shipped', 'delivered'],
          },
        },
      });

      // 2. Get total users
      const totalUsers = await this.prisma.user.count();

      // 3. Get total products
      const totalProducts = await this.prisma.product.count();

      // 4. Get pending KYC submissions
      const pendingKYC = await this.prisma.kYC.count({
        where: {
          status: KycStatus.pending, // This is a real enum and is correct
        },
      });

      return {
        totalRevenue: revenueData._sum.totalAmount || 0,
        totalUsers,
        totalProducts,
        pendingKYC,
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw new InternalServerErrorException('Could not load dashboard statistics.');
    }
  }
}