import { WithdrawalStatus } from '@prisma/client';
export declare class UpdateWithdrawalDto {
    status: WithdrawalStatus;
    adminRemarks?: string;
}
