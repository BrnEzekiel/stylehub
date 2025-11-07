// src/bookings/dto/create-booking.dto.ts

import { IsBoolean, IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsISO8601()
  startTime: string;

  @IsBoolean()
  @Type(() => Boolean)
  isHomeService: boolean;
}