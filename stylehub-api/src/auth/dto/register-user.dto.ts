// src/auth/dto/register-user.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum'; // 🛑 FIX: Use local enum

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  // NOTE: IsEnum validation is recommended here, but IsString is used based on your previous structure
  role: Role; 
}