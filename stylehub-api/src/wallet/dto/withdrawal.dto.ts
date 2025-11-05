// src/wallet/dto/withdrawal.dto.ts

import { IsDecimal, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawalRequestDto {
  @IsNumber()
  @Min(100) // Set a minimum withdrawal amount, e.g., 100
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsNotEmpty()
  mpesaNumber: string; // Or bank account, etc.
}