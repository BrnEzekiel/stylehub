// src/cart/dto/checkout.dto.ts

import { 
  IsNotEmpty, 
  IsString, 
  IsPhoneNumber,
  MinLength,  // 1. Import MinLength
  MaxLength   // 2. Import MaxLength
} from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  // 3. 🛑 REMOVED: @IsPhoneNumber(null)
  @MinLength(10) // 4. 🛑 ADDED: Ensures at least 10 digits
  @MaxLength(15) // 5. 🛑 ADDED: Allows for + and country code
  phone: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}