// src/cart/dto/add-item.dto.ts

import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class AddItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}