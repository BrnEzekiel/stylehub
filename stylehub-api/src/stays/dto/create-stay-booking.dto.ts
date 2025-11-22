import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, Min, Max, IsEnum } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateStayBookingDto {
  @ApiProperty({ description: 'ID of the stay to book', example: 'uuid-string' })
  @IsString()
  stayId: string;

  @ApiProperty({ description: 'Check-in date (ISO string)', example: '2025-01-15T14:00:00.000Z' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ description: 'Check-out date (ISO string)', example: '2025-01-20T11:00:00.000Z' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ description: 'Number of guests', example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  guestCount: number;

  @ApiProperty({
    description: 'Special requests or notes',
    example: 'Late check-in requested',
    required: false
  })
  @IsString()
  @IsOptional()
  specialRequests?: string;

  @ApiProperty({
    enum: PaymentMethod,
    description: 'Payment method for the booking',
    example: PaymentMethod.CARD,
    required: false
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Currency for the booking',
    example: 'KES',
    default: 'KES',
    required: false
  })
  @IsString()
  @IsOptional()
  currency?: string;
}
