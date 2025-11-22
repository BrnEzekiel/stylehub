// src/stats/stats.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addMonths, format, subDays, subWeeks, subMonths, subYears, startOfDay } from 'date-fns';
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

  async getSellerDashboardStats(userId: string) {
    try {
      // Basic Stats for current period
      const today = new Date();
      const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const prevMonthStart = addMonths(currentMonthStart, -1);
      const prevMonthEnd = addMonths(currentMonthEnd, -1);

      // --- Current Period Data ---
      const currentProductCount = await this.prisma.product.count({
        where: { sellerId: userId },
      });

      const currentOrderItems = await this.prisma.orderItem.findMany({
        where: {
          product: {
            sellerId: userId,
          },
          order: {
            status: {
              in: ['paid', 'shipped', 'delivered'],
            },
            createdAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd,
            },
          },
        },
        select: {
          orderId: true,
          sellerEarning: true,
        },
      });

      const currentTotalOrders = new Set(currentOrderItems.map(item => item.orderId)).size;
      const currentTotalRevenue = currentOrderItems.reduce((sum, item) => sum + parseFloat(item.sellerEarning.toString()), 0);

      // --- Previous Period Data ---
      const prevProductCount = await this.prisma.product.count({
        where: {
          sellerId: userId,
          createdAt: {
            gte: prevMonthStart,
            lte: prevMonthEnd,
          },
        },
      });

      const prevOrderItems = await this.prisma.orderItem.findMany({
        where: {
          product: {
            sellerId: userId,
          },
          order: {
            status: {
              in: ['paid', 'shipped', 'delivered'],
            },
            createdAt: {
              gte: prevMonthStart,
              lte: prevMonthEnd,
            },
          },
        },
        select: {
          orderId: true,
          sellerEarning: true,
        },
      });

      const prevTotalOrders = new Set(prevOrderItems.map(item => item.orderId)).size;
      const prevTotalRevenue = prevOrderItems.reduce((sum, item) => sum + parseFloat(item.sellerEarning.toString()), 0);

      // --- Calculate Growth ---
      const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0; // If previous was 0 and current is >0, 100% growth (or 0 if current is also 0)
        return parseFloat((((current - previous) / previous) * 100).toFixed(1));
      };

      const revenueGrowth = calculateGrowth(currentTotalRevenue, prevTotalRevenue);
      const productGrowth = calculateGrowth(currentProductCount, prevProductCount);
      const ordersGrowth = calculateGrowth(currentTotalOrders, prevTotalOrders);


      const stats = [
        { id: '1', title: 'Total Revenue', value: `KSH ${currentTotalRevenue.toFixed(2)}`, growth: revenueGrowth, icon: '💰' },
        { id: '2', title: 'Total Products', value: currentProductCount, growth: productGrowth, icon: '📦' },
        { id: '3', title: 'Total Orders', value: currentTotalOrders, growth: ordersGrowth, icon: '🛒' },
      ];

      // Recent Orders (last 5)
      const recentOrderItems = await this.prisma.orderItem.findMany({
        where: {
          product: {
            sellerId: userId,
          },
          order: {
            status: {
              in: ['paid', 'shipped', 'delivered'],
            },
          },
        },
        distinct: ['orderId'],
        orderBy: {
          order: {
            createdAt: 'desc',
          },
        },
        take: 5,
        select: {
          order: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      const formattedRecentOrders = recentOrderItems.map(item => ({
        id: item.order.id,
        customer: item.order.user?.username || 'N/A',
        amount: `KSH ${item.order.totalAmount.toFixed(2)}`,
        status: item.order.status,
      }));

      // Seller's Products (last 5 added)
      const products = await this.prisma.product.findMany({
        where: {
          sellerId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
        },
      });

      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        price: `KSH ${product.price.toFixed(2)}`,
        stock: product.stock,
      }));

      return {
        stats,
        recentOrders: formattedRecentOrders,
        products: formattedProducts,
      };
    } catch (error) {
      console.error(`Error fetching seller stats for user ${userId}:`, error);
      throw new InternalServerErrorException('Could not load seller statistics.');
    }
  }

  async getSellerRevenueData(userId: string, period: string) {
    try {
      const today = new Date();
      let startDate: Date;
      let dateFormat: string;
      let aggregationUnit: 'day' | 'month';

      switch (period) {
        case '1day':
          startDate = subDays(today, 1);
          dateFormat = 'HH:00';
          aggregationUnit = 'day';
          break;
        case '1week':
          startDate = subWeeks(today, 1);
          dateFormat = 'EEE, MMM d';
          aggregationUnit = 'day';
          break;
        case '1month':
          startDate = subMonths(today, 1);
          dateFormat = 'MMM d';
          aggregationUnit = 'day';
          break;
        case '6months':
          startDate = subMonths(today, 6);
          dateFormat = 'MMM yyyy';
          aggregationUnit = 'month';
          break;
        case '1year':
          startDate = subYears(today, 1);
          dateFormat = 'MMM yyyy';
          aggregationUnit = 'month';
          break;
        default:
          startDate = subMonths(today, 6); // Default to 6 months
          dateFormat = 'MMM yyyy';
          aggregationUnit = 'month';
          break;
      }

      // Fetch all relevant order items for the period
      const relevantOrderItems = await this.prisma.orderItem.findMany({
        where: {
          product: {
            sellerId: userId,
          },
          order: {
            status: {
              in: ['paid', 'shipped', 'delivered'],
            },
            createdAt: {
              gte: startDate,
              lte: today,
            },
          },
        },
        select: {
          sellerEarning: true,
          order: {
            select: {
              createdAt: true,
            },
          },
        },
        orderBy: {
          order: {
            createdAt: 'asc',
          },
        },
      });

      const aggregatedDataMap = new Map<string, number>();
      
      // Initialize map with all units for the period
      let currentIterateDate = new Date(startDate);
      while (currentIterateDate <= today) {
        let label: string;
        if (aggregationUnit === 'day') {
          label = format(currentIterateDate, dateFormat);
        } else { // month
          label = format(currentIterateDate, dateFormat);
        }
        aggregatedDataMap.set(label, 0);

        if (aggregationUnit === 'day') {
          currentIterateDate.setDate(currentIterateDate.getDate() + 1);
        } else { // month
          currentIterateDate.setMonth(currentIterateDate.getMonth() + 1);
        }
        if (currentIterateDate.getMonth() === today.getMonth() && currentIterateDate.getFullYear() === today.getFullYear() && aggregationUnit === 'month') {
          // Prevent infinite loop if today is end of month and adding month doesn't progress
          if (currentIterateDate <= subDays(today,1)) { // Ensure it's not trying to go beyond today if in last month
            currentIterateDate = today;
          } else {
            break;
          }
        }
        if (currentIterateDate > today && aggregationUnit === 'day') break; // Stop if trying to go beyond today
      }

      relevantOrderItems.forEach(item => {
        const itemDate = item.order.createdAt;
        let label: string;
        if (aggregationUnit === 'day') {
          label = format(itemDate, dateFormat);
        } else { // month
          label = format(itemDate, dateFormat);
        }
        const currentTotal = aggregatedDataMap.get(label) || 0;
        aggregatedDataMap.set(label, currentTotal + parseFloat(item.sellerEarning.toString()));
      });
      
      const labels = Array.from(aggregatedDataMap.keys());
      const data = Array.from(aggregatedDataMap.values());

      return {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: data,
            backgroundColor: 'rgba(0, 191, 255, 0.6)', // Bright sky blue with transparency
            borderColor: 'rgba(0, 191, 255, 1)',       // Solid bright sky blue
            borderWidth: 1,
            fill: true,
            tension: 0.4, // Smooth the line chart
          },
        ],
      };

    } catch (error) {
      console.error(`Error fetching seller revenue data for user ${userId} and period ${period}:`, error);
      throw new InternalServerErrorException('Could not load seller revenue data.');
    }
  }
}