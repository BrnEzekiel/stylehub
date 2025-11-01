// src/kyc/dto/update-kyc.dto.ts
import { IsIn, IsString } from 'class-validator';
import { KycStatus } from '@prisma/client';

export class UpdateKycStatusDto {
  @IsString()
  @IsIn([KycStatus.approved, KycStatus.rejected])
  status: KycStatus;
}