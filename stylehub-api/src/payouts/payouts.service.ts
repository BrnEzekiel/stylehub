// src/payouts/payouts.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayoutStatus, Prisma } from '@prisma/client';

@Injectable()
export class PayoutsService { // 🛑 I missed the 'export' keyword here. It is now fixed.
  constructor(private prisma: PrismaService) {}

  /**
   * Gets the high-level financial summary for the entire platform.
   */
  async getFinancialSummary() {
    try {
      // 1. Calculate all earnings that have NOT been paid out yet
      const unpaidEarnings = await this.prisma.orderItem.aggregate({
        _sum: {
          sellerEarning: true,
        },
        where: {
          payoutId: null, // Not yet in a payout
          order: {
            status: 'delivered', // Only pay for delivered orders
          },
          product: {
            sellerId: {
              not: null, // Only for items sold by sellers
            },
          },
        },
      });

      // 2. Calculate total platform fees collected from delivered orders
      const totalPlatformFees = await this.prisma.orderItem.aggregate({
        _sum: {
          platformFee: true,
        },
        where: {
          order: {
            status: 'delivered',
          },
        },
      });

      // 3. Calculate total money already paid out to sellers
      const totalPaidOut = await this.prisma.payout.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'paid',
        },
      });

      return {
        totalOwedToSellers: unpaidEarnings._sum.sellerEarning || 0,
        totalPlatformRevenue: totalPlatformFees._sum.platformFee || 0,
        totalPaidOutToSellers: totalPaidOut._sum.amount || 0,
      };
    } catch (error) {
      console.error('Error in getFinancialSummary:', error);
      throw new InternalServerErrorException('Could not retrieve financial summary.');
    }
  }

  /**
   * Gets a summary of all sellers, their unpaid earnings, and payout history.
   */
  async getSellerPayoutSummaries() {
    try {
      // 1. Get all users who are sellers
      const sellers = await this.prisma.user.findMany({
        where: { role: 'seller' },
        select: {
          id: true,
          name: true,
          email: true,
          payouts: { // 2. Get their payout history
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      // 3. For each seller, calculate their unpaid earnings
      const sellerSummaries = await Promise.all(
        sellers.map(async (seller) => {
          const unpaid = await this.prisma.orderItem.aggregate({
            _sum: {
              sellerEarning: true,
            },
            where: {
              product: {
                sellerId: seller.id,
              },
              order: {
                status: 'delivered',
              },
              payoutId: null, // Not yet paid
            },
          });

          return {
            ...seller,
            unpaidEarnings: unpaid._sum.sellerEarning || 0,
          };
        }),
      );

      return sellerSummaries;
    } catch (error) {
      console.error('Error in getSellerPayoutSummaries:', error);
      throw new InternalServerErrorException('Could not retrieve seller payout summaries.');
    }
  }

  /**
   * Creates a new payout for a seller for all their unpaid, delivered items.
   */
  async createPayout(sellerId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Find all eligible order items
      const unpaidItems = await tx.orderItem.findMany({
        where: {
          product: {
            sellerId: sellerId,
          },
          order: {
            status: 'delivered',
          },
          payoutId: null,
        },
        select: {
          id: true,
          sellerEarning: true,
        },
      });

      if (unpaidItems.length === 0) {
        throw new BadRequestException('This seller has no unpaid earnings from delivered orders.');
      }

      // 2. Calculate the total payout amount
      const totalAmount = unpaidItems.reduce((acc, item) => {
        return acc.add(item.sellerEarning);
      }, new Prisma.Decimal(0));

      if (totalAmount.lessThanOrEqualTo(0)) {
        throw new BadRequestException('Seller has no positive earnings to pay out.');
      }

      // 3. Create the new Payout record
      const newPayout = await tx.payout.create({
        data: {
          sellerId: sellerId,
          amount: totalAmount,
          status: 'pending',
        },
      });

      // 4. Link all unpaid items to this new payout
      await tx.orderItem.updateMany({
        where: {
          id: {
            in: unpaidItems.map((item) => item.id),
          },
        },
        data: {
          payoutId: newPayout.id,
        },
      });

      return newPayout;
    });
  }

  /**
   * Marks a specific payout as "paid".
   */
  async markPayoutAsPaid(payoutId: string) {
    try {
      const payout = await this.prisma.payout.findUnique({
        where: { id: payoutId },
      });

      if (!payout) {
        throw new NotFoundException('Payout not found.');
      }

      if (payout.status === 'paid') {
        throw new BadRequestException('This payout has already been marked as paid.');
      }

      return await this.prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: 'paid',
          paidAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`Error marking payout ${payoutId} as paid:`, error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not update payout status.');
    }
  }
}