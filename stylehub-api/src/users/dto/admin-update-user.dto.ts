// src/users/dto/admin-update-user.dto.ts

import { IsEmail, IsIn, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
  
  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  @IsOptional()
  @IsString()
  @IsIn([Role.Admin, Role.Client, Role.Seller])
  role?: Role;
}