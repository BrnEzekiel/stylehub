import { PayoutsService } from './payouts.service';
export declare class PayoutsController {
    private readonly payoutsService;
    constructor(payoutsService: PayoutsService);
    getFinancialSummary(): Promise<{
        totalOwedToSellers: number | import("@prisma/client/runtime/library").Decimal;
        totalPlatformRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalPaidOutToSellers: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getSellerPayoutSummaries(): Promise<{
        unpaidEarnings: number | import("@prisma/client/runtime/library").Decimal;
        name: string;
        email: string;
        id: string;
        payouts: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PayoutStatus;
            sellerId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paidAt: Date | null;
        }[];
    }[]>;
    createPayout(sellerId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        sellerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
    }>;
    markPayoutAsPaid(payoutId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        sellerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date | null;
    }>;
}
