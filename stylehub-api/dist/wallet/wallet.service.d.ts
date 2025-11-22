import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { WithdrawalRequestDto } from './dto/withdrawal.dto';
export declare class WalletService {
    private prisma;
    constructor(prisma: PrismaService);
    addPayoutToWallet(tx: Prisma.TransactionClient, sellerId: string, amount: Prisma.Decimal, payoutId: string): Promise<void>;
    getWalletDetails(userId: string): Promise<{
        walletBalance: Prisma.Decimal;
        walletTransactions: {
            id: string;
            createdAt: Date;
            userId: string;
            description: string;
            type: import(".prisma/client").$Enums.TransactionType;
            amount: Prisma.Decimal;
            balance: Prisma.Decimal;
            reference: string | null;
            metadata: Prisma.JsonValue | null;
        }[];
    }>;
    requestWithdrawal(userId: string, dto: WithdrawalRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatus;
        sellerId: string;
        amount: Prisma.Decimal;
        mpesaNumber: string;
        reference: string | null;
        walletTransactionId: string | null;
        processedAt: Date | null;
        processedBy: string | null;
        idNumber: string | null;
        idDocumentUrl: string | null;
        adminRemarks: string | null;
    }>;
    createBookingHold(tx: Prisma.TransactionClient, clientId: string, amount: Prisma.Decimal, bookingId: string): Promise<void>;
    releaseBookingHold(tx: Prisma.TransactionClient, bookingId: string, providerId: string, amount: Prisma.Decimal): Promise<void>;
}
