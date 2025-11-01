// src/kyc/dto/submit-kyc.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitKycDto {
  @IsString()
  @IsNotEmpty()
  doc_type: string;
}