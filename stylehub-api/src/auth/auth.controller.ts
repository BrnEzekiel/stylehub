// src/auth/auth.controller.ts

import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get, // 1. Import Get
  NotFoundException, // 2. Import NotFoundException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshPlaceholder(@Body('refreshToken') refreshToken?: string) {
    if (!refreshToken) {
      return { message: "Refresh route needs refreshToken in body." };
    }
    // We'll properly implement this later if needed
    return this.authService.refresh(refreshToken);
  }

  // 3. 🛑 FIX: Changed from @Post to @Get
  @Get('profile')
  @UseGuards(JwtAuthGuard) // Protects the route, ensures req.user exists
  async getProfile(@Request() req) {
    // req.user is populated by JwtAuthGuard
    // It contains { sub: userId, email: '...', role: '...' }
    const userEmail = req.user.email;
    if (!userEmail) {
      throw new NotFoundException('User email not found in token');
    }
    // 4. Call the service to get full, fresh user data
    return this.authService.getProfileByEmail(userEmail);
  }
}