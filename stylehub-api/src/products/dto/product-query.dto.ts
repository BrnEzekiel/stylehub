// src/products/dto/product-query.dto.ts

import { IsOptional, IsString, IsIn, IsNumberString, IsBooleanString } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;
  
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  minRating?: string;
  
  @IsOptional()
  @IsBooleanString()
  inStockOnly?: string;

  @IsOptional()
  @IsString()
  @IsIn(['price-asc', 'price-desc', 'createdAt', 'name', 'rating'])
  sortBy?: 'price-asc' | 'price-desc' | 'createdAt' | 'name' | 'rating';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}