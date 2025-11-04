import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class PayoutsService {
    private prisma;
    constructor(prisma: PrismaService);
    getFinancialSummary(): Promise<{
        totalOwedToSellers: number | Prisma.Decimal;
        totalPlatformRevenue: number | Prisma.Decimal;
        totalPaidOutToSellers: number | Prisma.Decimal;
    }>;
    getSellerPayoutSummaries(): Promise<{
        unpaidEarnings: number | Prisma.Decimal;
        name: string;
        email: string;
        id: string;
        payouts: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PayoutStatus;
            sellerId: string;
            amount: Prisma.Decimal;
            paidAt: Date | null;
        }[];
    }[]>;
    createPayout(sellerId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        sellerId: string;
        amount: Prisma.Decimal;
        paidAt: Date | null;
    }>;
    markPayoutAsPaid(payoutId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        sellerId: string;
        amount: Prisma.Decimal;
        paidAt: Date | null;
    }>;
}
