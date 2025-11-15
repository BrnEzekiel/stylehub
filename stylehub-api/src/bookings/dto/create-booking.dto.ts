// src/bookings/dto/create-booking.dto.ts
import { IsBoolean, IsISO8601, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsISO8601()
  startTime: string;

  @IsBoolean()
  @Type(() => Boolean)
  isHomeService: boolean;

  @IsEnum(PaymentMethod) // ✅ Use enum
  paymentMethod: PaymentMethod;
}