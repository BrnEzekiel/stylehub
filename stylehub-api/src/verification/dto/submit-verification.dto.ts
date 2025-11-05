// src/verification/dto/submit-verification.dto.ts

import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class SubmitVerificationDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsOptional()
  @IsUrl()
  socialMediaUrl?: string;
}