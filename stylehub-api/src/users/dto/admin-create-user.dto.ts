// src/users/dto/admin-create-user.dto.ts

import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class AdminCreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
  
  @IsPhoneNumber(null)
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsIn([Role.Admin, Role.Client, Role.Seller])
  role: Role;
}