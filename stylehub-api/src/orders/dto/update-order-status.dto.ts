// src/orders/dto/update-order-status.dto.ts

import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
}