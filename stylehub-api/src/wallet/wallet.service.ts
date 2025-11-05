// src/wallet/wallet.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionType, WithdrawalStatus } from '@prisma/client';
import { WithdrawalRequestDto } from './dto/withdrawal.dto';

@Injectable()
export class WalletService { // 🛑 THE FIX: Added 'export' here.
  constructor(private prisma: PrismaService) {}

  /**
   * (INTERNAL) Adds funds to a seller's wallet, called from PayoutsService.
   */
  async addPayoutToWallet(
    tx: Prisma.TransactionClient,
    sellerId: string,
    amount: Prisma.Decimal,
    payoutId: string,
  ) {
    try {
      // 1. Update the user's wallet balance
      const updatedUser = await tx.user.update({
        where: { id: sellerId },
        data: {
          walletBalance: {
            increment: amount,
          },
        },
      });

      // 2. Create a "receipt" transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          userId: sellerId,
          type: TransactionType.credit,
          amount: amount,
          description: `Payout from Payout ID: ${payoutId.substring(0, 8)}`,
        },
      });

      // 3. Link the payout to this transaction
      await tx.payout.update({
        where: { id: payoutId },
        data: {
          walletTransactionId: transaction.id,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Failed to add payout to wallet:', error);
      throw new InternalServerErrorException('Could not update wallet balance.');
    }
  }

  /**
   * (CLIENT) Get a seller's wallet balance and transaction history.
   */
  async getWalletDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        walletBalance: true,
        walletTransactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20, // Get the last 20 transactions
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * (CLIENT) A seller requests to withdraw funds.
   */
  async requestWithdrawal(userId: string, dto: WithdrawalRequestDto) {
    const amountToWithdraw = new Prisma.Decimal(dto.amount);

    return this.prisma.$transaction(async (tx) => {
      // 1. Get the user and lock the row for update
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 2. Check if they have enough funds
      if (user.walletBalance.lessThan(amountToWithdraw)) {
        throw new BadRequestException('Insufficient wallet balance.');
      }

      // 3. Debit the wallet balance immediately
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: amountToWithdraw,
          },
        },
      });

      // 4. Create a "debit" transaction receipt
      const transaction = await tx.walletTransaction.create({
        data: {
          userId: userId,
          type: TransactionType.debit,
          amount: amountToWithdraw.negated(), // Store as a negative number
          description: `Withdrawal request to ${dto.mpesaNumber}`,
        },
      });

      // 5. Create the withdrawal request for admin to approve
      const withdrawalRequest = await tx.withdrawalRequest.create({
        data: {
          sellerId: userId,
          amount: amountToWithdraw,
          status: WithdrawalStatus.pending,
          mpesaNumber: dto.mpesaNumber,
          walletTransactionId: transaction.id, // Link to the debit transaction
        },
      });

      return withdrawalRequest;
    });
  }
}