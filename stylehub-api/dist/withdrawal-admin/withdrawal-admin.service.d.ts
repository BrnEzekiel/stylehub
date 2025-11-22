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
    })[]>;
    updateWithdrawalStatus(requestId: string, newStatus: WithdrawalStatus, adminRemarks: string): Promise<{
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
}
