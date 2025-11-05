import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { WithdrawalRequestDto } from './dto/withdrawal.dto';
export declare class WalletService {
    private prisma;
    constructor(prisma: PrismaService);
    addPayoutToWallet(tx: Prisma.TransactionClient, sellerId: string, amount: Prisma.Decimal, payoutId: string): Promise<{
        name: string | null;
        email: string;
        phone: string;
        role: string;
        id: string;
        password_hash: string;
        createdAt: Date;
        updatedAt: Date;
        walletBalance: Prisma.Decimal;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
    }>;
    getWalletDetails(userId: string): Promise<{
        walletBalance: Prisma.Decimal;
        walletTransactions: {
            id: string;
            createdAt: Date;
            description: string;
            userId: string;
            type: import(".prisma/client").$Enums.TransactionType;
            amount: Prisma.Decimal;
        }[];
    }>;
    requestWithdrawal(userId: string, dto: WithdrawalRequestDto): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatus;
        sellerId: string;
        amount: Prisma.Decimal;
        mpesaNumber: string;
        walletTransactionId: string | null;
        processedAt: Date | null;
    }>;
}
