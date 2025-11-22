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
export class WalletService {
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
        select: { walletBalance: true }, // Select the new balance
      });

      // 2. Create a "receipt" transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          user: { connect: { id: sellerId } }, // FIX: Use connect
          type: TransactionType.DEPOSIT,
          amount: amount,
          balance: updatedUser.walletBalance, // FIX: Add new balance
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
          take: 20,
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
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.walletBalance.lessThan(amountToWithdraw)) {
        throw new BadRequestException('Insufficient wallet balance.');
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: amountToWithdraw,
          },
        },
        select: { walletBalance: true }, // Select the new balance
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          user: { connect: { id: userId } }, // FIX: Use connect
          type: TransactionType.WITHDRAWAL,
          amount: amountToWithdraw.negated(),
          balance: updatedUser.walletBalance, // FIX: Add new balance
          description: `Withdrawal request to ${dto.mpesaNumber}`,
        },
      });

      const withdrawalRequest = await tx.withdrawalRequest.create({
        data: {
          sellerId: userId,
          amount: amountToWithdraw,
          status: WithdrawalStatus.pending,
          mpesaNumber: dto.mpesaNumber,
          walletTransactionId: transaction.id,
        },
      });

      return withdrawalRequest;
    });
  }

  // --- 🛑 NEW: BOOKING & ESCROW METHODS ---

  /**
   * (INTERNAL) Holds funds from a client's wallet for a booking.
   */
  async createBookingHold(
    tx: Prisma.TransactionClient,
    clientId: string,
    amount: Prisma.Decimal,
    bookingId: string,
  ) {
    // 1. Get user and check balance
    const user = await tx.user.findUnique({ where: { id: clientId } });
    if (!user) {
      throw new NotFoundException('Client not found');
    }
    if (user.walletBalance.lessThan(amount)) {
      throw new BadRequestException('Insufficient wallet balance to make booking.');
    }

    // 2. Debit the client's wallet
    const updatedUser = await tx.user.update({
      where: { id: clientId },
      data: {
        walletBalance: {
          decrement: amount,
        },
      },
      select: { walletBalance: true }, // Select the new balance
    });

    // 3. Create a "debit" transaction receipt (escrow hold)
    const transaction = await tx.walletTransaction.create({
      data: {
        user: { connect: { id: clientId } }, // FIX: Use connect
        type: TransactionType.PAYMENT,
        amount: amount.negated(),
        balance: updatedUser.walletBalance, // FIX: Add new balance
        description: `Escrow hold for Booking ID: ${bookingId.substring(0, 8)}`,
        booking: { connect: { id: bookingId } },
      },
    });

    // 4. Link the booking to this transaction
    await tx.booking.update({
      where: { id: bookingId },
      data: { walletTransactionId: transaction.id },
    });
  }

  /**
   * (INTERNAL) Releases held funds to a provider after a booking is completed.
   */
  async releaseBookingHold(
    tx: Prisma.TransactionClient,
    bookingId: string,
    providerId: string,
    amount: Prisma.Decimal,
  ) {
    // 1. Credit the provider's wallet
    const updatedUser = await tx.user.update({
      where: { id: providerId },
      data: {
        walletBalance: {
          increment: amount,
        },
      },
      select: { walletBalance: true }, // Select the new balance
    });

    // 2. Create a "credit" transaction receipt for the provider
    await tx.walletTransaction.create({
      data: {
        user: { connect: { id: providerId } }, // FIX: Use connect
        type: TransactionType.EARNING,
        amount: amount,
        balance: updatedUser.walletBalance, // FIX: Add new balance
        description: `Payment for Booking ID: ${bookingId.substring(0, 8)}`,
        booking: { connect: { id: bookingId } },
      },
    });
  }
}