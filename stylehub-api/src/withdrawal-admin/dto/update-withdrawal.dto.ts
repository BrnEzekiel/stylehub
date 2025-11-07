// src/withdrawal-admin/dto/update-withdrawal.dto.ts

import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { WithdrawalStatus } from '@prisma/client';

export class UpdateWithdrawalDto {
  @IsString()
  @IsIn([WithdrawalStatus.approved, WithdrawalStatus.rejected])
  status: WithdrawalStatus;

  @IsString()
  @IsOptional()
  adminRemarks?: string;
}