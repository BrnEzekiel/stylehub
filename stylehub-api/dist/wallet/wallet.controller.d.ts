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
            userId: string;
            description: string;
            type: import(".prisma/client").$Enums.TransactionType;
            amount: import("@prisma/client/runtime/library").Decimal;
            balance: import("@prisma/client/runtime/library").Decimal;
            reference: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    requestWithdrawal(req: any, dto: WithdrawalRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatus;
        sellerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
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
