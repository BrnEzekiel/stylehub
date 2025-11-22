import { IsIn, IsString } from 'class-validator';
import { VerificationStatus } from '@prisma/client';

export class UpdateProviderPortfolioStatusDto {
  @IsString()
  @IsIn([
    VerificationStatus.verified,
    VerificationStatus.rejected,
  ])
  status: VerificationStatus;
}
