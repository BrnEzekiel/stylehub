// src/reviews/dto/review-query.dto.ts

import { IsOptional, IsString, IsNumberString, IsInt, Min, Max } from 'class-validator';

export class ReviewQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
  
  @IsOptional()
  @IsString()
  productId?: string; // Filter reviews by a specific product ID

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number; // Filter by minimum rating
}