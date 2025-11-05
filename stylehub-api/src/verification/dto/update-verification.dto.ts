// src/verification/dto/update-verification.dto.ts

import { IsIn, IsString } from 'class-validator';
import { VerificationStatus } from '@prisma/client';

export class UpdateVerificationStatusDto {
  @IsString()
  @IsIn([
    VerificationStatus.approved,
    VerificationStatus.rejected,
  ])
  status: VerificationStatus;
}