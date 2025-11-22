// src/payouts/payouts.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayoutStatus, Prisma } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service'; // 1. 🛑 Import WalletService

@Injectable()
export class PayoutsService { // 🛑 This 'export' is correct
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService, // 2. 🛑 Inject WalletService
  ) {}

  /**
   * Gets the high-level financial summary for the entire platform.
   */
  async getFinancialSummary() {
    try {
      const unpaidEarnings = await this.prisma.orderItem.aggregate({
        _sum: {
          sellerEarning: true,
        },
        where: {
          payoutId: null,
          order: {
            status: 'delivered',
          },
          product: {
            sellerId: {
              not: null,
            },
          },
        },
      });

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
      const sellers = await this.prisma.user.findMany({
        where: { role: 'seller' },
        select: {
          id: true,
          name: true,
          email: true,
          payouts: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

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
              payoutId: null,
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

      const totalAmount = unpaidItems.reduce((acc, item) => {
        return acc.add(item.sellerEarning);
      }, new Prisma.Decimal(0));

      if (totalAmount.lessThanOrEqualTo(0)) {
        throw new BadRequestException('Seller has no positive earnings to pay out.');
      }

      const newPayout = await tx.payout.create({
        data: {
          sellerId: sellerId,
          amount: totalAmount,
          status: 'pending',
        },
      });

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
   * 🛑 UPDATED: Marks a specific payout as "paid" AND funds the seller's wallet.
   */
  async markPayoutAsPaid(payoutId: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Find and lock the payout
        const payout = await tx.payout.findUnique({
          where: { id: payoutId },
        });

        if (!payout) {
          throw new NotFoundException('Payout not found.');
        }

        if (payout.status === 'paid') {
          throw new BadRequestException('This payout has already been marked as paid.');
        }

        // 2. Update the payout status
        const updatedPayout = await tx.payout.update({
          where: { id: payoutId },
          data: {
            status: 'paid',
            processedAt: new Date(),
          },
        });

        // 3. 🛑 NEW: Call WalletService to credit the seller's wallet
        await this.walletService.addPayoutToWallet(
          tx,
          payout.sellerId,
          payout.amount,
          payout.id,
        );

        return updatedPayout;
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