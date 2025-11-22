import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, IsEnum, IsBoolean, IsDateString, Min, Max, IsLatitude, IsLongitude } from 'class-validator';
import { StayType, AmenityType } from '@prisma/client';

export class CreateStayDto {
  @ApiProperty({ description: 'Title of the stay', example: 'Cozy Apartment in Downtown' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed description of the stay', example: 'A beautiful and cozy apartment located in the heart of the city...' })
  @IsString()
  description: string;

  @ApiProperty({ enum: StayType, description: 'Type of the stay' })
  @IsEnum(StayType)
  type: StayType;

  @ApiProperty({ description: 'Price per month in local currency', example: 1200 })
  @IsNumber()
  @Min(0)
  pricePerMonth: number;

  @ApiProperty({ description: 'Full address of the stay', example: '123 Main St, Anytown, AN 12345' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'City where the stay is located', example: 'Nairobi' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State or region where the stay is located', example: 'Nairobi' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Country where the stay is located', example: 'Kenya' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Latitude coordinate of the stay location', example: -1.2921, required: false })
  @IsNumber()
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ description: 'Longitude coordinate of the stay location', example: 36.8219, required: false })
  @IsNumber()
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({ description: 'Maximum number of occupants allowed', example: 2 })
  @IsNumber()
  @Min(1)
  maxOccupants: number;

  @ApiProperty({ description: 'Date from when the stay is available (ISO string)', example: '2025-01-01T00:00:00.000Z' })
  @IsDateString()
  availableFrom: string;

  @ApiProperty({ 
    description: 'Date until when the stay is available (ISO string)', 
    example: '2025-12-31T23:59:59.999Z',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  availableTo?: string;

  @ApiProperty({ 
    type: [String], 
    enum: Object.values(AmenityType),
    description: 'List of amenities available at the stay',
    required: false
  })
  @IsArray()
  @IsEnum(Object.values(AmenityType), { each: true })
  @IsOptional()
  amenities?: AmenityType[];

  @ApiProperty({ 
    description: 'Additional rules or notes for guests',
    example: 'No smoking, No pets allowed',
    required: false
  })
  @IsString()
  @IsOptional()
  houseRules?: string;

  @ApiProperty({ 
    description: 'Cancellation policy for the stay',
    example: 'Free cancellation up to 7 days before check-in',
    required: false
  })
  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @ApiProperty({ 
    description: 'Check-in time in 24-hour format',
    example: '14:00',
    required: false,
    default: '14:00'
  })
  @IsString()
  @IsOptional()
  checkInTime?: string;

  @ApiProperty({ 
    description: 'Check-out time in 24-hour format',
    example: '11:00',
    required: false,
    default: '11:00'
  })
  @IsString()
  @IsOptional()
  checkOutTime?: string;

  @ApiProperty({ 
    description: 'Whether the stay is currently available for booking',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
