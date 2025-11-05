import { WalletService } from './wallet.service';
import { WithdrawalRequestDto } from './dto/withdrawal.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWalletDetails(req: any): Promise<{
        walletBalance: import("@prisma/client/runtime/library").Decimal;
        walletTransactions: {
            id: string;
            createdAt: Date;
            description: string;
            userId: string;
            type: import(".prisma/client").$Enums.TransactionType;
            amount: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
    requestWithdrawal(req: any, dto: WithdrawalRequestDto): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatus;
        sellerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        mpesaNumber: string;
        walletTransactionId: string | null;
        processedAt: Date | null;
    }>;
}
