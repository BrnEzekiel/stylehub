import { PrismaService } from '../prisma/prisma.service';
import { Prisma, WithdrawalStatus } from '@prisma/client';
export declare class WithdrawalAdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllWithdrawalRequests(): Promise<({
        seller: {
            name: string;
            email: string;
            phone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatus;
        sellerId: string;
        amount: Prisma.Decimal;
        mpesaNumber: string;
        walletTransactionId: string | null;
        processedAt: Date | null;
        adminRemarks: string | null;
    })[]>;
    updateWithdrawalStatus(requestId: string, newStatus: WithdrawalStatus, adminRemarks: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatus;
        sellerId: string;
        amount: Prisma.Decimal;
        mpesaNumber: string;
        walletTransactionId: string | null;
        processedAt: Date | null;
        adminRemarks: string | null;
    }>;
}
