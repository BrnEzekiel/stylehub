// src/products/dto/create-product.dto.ts

import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer'; // Import Type decorator

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // Add @Type to transform the incoming string from form-data to a number
  @IsNumber()
  @Type(() => Number)
  price: number;

  // Add @Type to transform the incoming string from form-data to a number
  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsNotEmpty()
  category: string;
  
  // Make imageUrl optional, as it's generated from the file
  @IsOptional()
  @IsUrl()
  imageUrl?: string; 
}