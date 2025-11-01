// src/products/dto/product-query.dto.ts

import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string; // Search by name or description

  @IsOptional()
  @IsString()
  category?: string; // Filter by category name (or ID)

  @IsOptional()
  @IsString()
  @IsIn(['price', 'createdAt', 'name'])
  sortBy?: 'price' | 'createdAt' | 'name'; // Field to sort by

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc'; // Sort direction (default: 'desc')

  @IsOptional()
  @IsNumberString()
  page?: string; // Current page number (for pagination)

  @IsOptional()
  @IsNumberString()
  limit?: string; // Items per page (for pagination)
}