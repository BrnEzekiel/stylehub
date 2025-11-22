import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// FIX: Added TransactionType
import { Prisma, WithdrawalStatus, TransactionType } from '@prisma/client';

@Injectable()
export class WithdrawalAdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all withdrawal requests (pending, then others)
   */
  async getAllWithdrawalRequests() {
    try {
      return await this.prisma.withdrawalRequest.findMany({
        include: {
          seller: {
            select: { name: true, email: true, phone: true },
          },
        },
        orderBy: [
          { status: 'asc' }, // 'pending' comes first
          { createdAt: 'desc' },
        ],
      });
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      throw new InternalServerErrorException('Could not fetch withdrawal requests.');
    }
  }

  /**
   * Approve or Reject a withdrawal request
   */
  async updateWithdrawalStatus(
    requestId: string,
    newStatus: WithdrawalStatus,
    adminRemarks: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Find the request
      const request = await tx.withdrawalRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Withdrawal request not found.');
      }
      if (request.status !== WithdrawalStatus.pending) {
        throw new BadRequestException(`Request is already ${request.status}.`);
      }

      // 2. If REJECTED, refund the money to the seller's wallet
      if (newStatus === WithdrawalStatus.rejected) {
        // 2a. Refund the user's wallet
        const updatedUser = await tx.user.update({
          where: { id: request.sellerId },
          data: {
            walletBalance: {
              increment: request.amount, // Give the money back
            },
          },
          select: { walletBalance: true }, // FIX: Get the new balance
        });

        // 2b. Create a "credit" transaction for the refund
        await tx.walletTransaction.create({
          data: {
            user: { connect: { id: request.sellerId } }, // FIX: Use connect
            type: TransactionType.REFUND, // FIX: Use correct enum value
            amount: request.amount,
            balance: updatedUser.walletBalance, // FIX: Add mandatory balance
            description: `Refund for rejected withdrawal: ${
              adminRemarks || 'Rejected by admin'
            }`,
            withdrawalRequest: { connect: { id: request.id } },
          },
        });
      }

      // 3. Update the request status
      return tx.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: newStatus,
          adminRemarks: adminRemarks,
          processedAt: new Date(),
        },
      });
    });
  }
}