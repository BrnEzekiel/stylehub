import { WithdrawalAdminService } from './withdrawal-admin.service';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
export declare class WithdrawalAdminController {
    private readonly adminService;
    constructor(adminService: WithdrawalAdminService);
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
        amount: import("@prisma/client/runtime/library").Decimal;
        mpesaNumber: string;
        walletTransactionId: string | null;
        processedAt: Date | null;
        adminRemarks: string | null;
    })[]>;
    updateWithdrawalStatus(id: string, dto: UpdateWithdrawalDto): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatus;
        sellerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        mpesaNumber: string;
        walletTransactionId: string | null;
        processedAt: Date | null;
        adminRemarks: string | null;
    }>;
}
