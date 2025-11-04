// src/products/dto/admin-update-product.dto.ts

import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsInt,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminUpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number) // Transform string to number
  price?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Transform string to number
  stock?: number;

  @IsOptional()
  @IsString()
  category?: string;
}