// src/services/dto/create-service.dto.ts

import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceShopCents: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceHomeCents?: number;

  @IsBoolean()
  @Type(() => Boolean)
  offersHome: boolean;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  durationMinutes: number;
}