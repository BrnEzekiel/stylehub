// src/orders/dto/order-query.dto.ts

import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class OrderQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
  status?: string; // Filter by status

  @IsOptional()
  @IsNumberString()
  page?: string; // Current page number (for pagination)

  @IsOptional()
  @IsNumberString()
  limit?: string; // Items per page (for pagination)
}