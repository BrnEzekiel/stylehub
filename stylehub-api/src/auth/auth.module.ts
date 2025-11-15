// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
// 1. 🛑 REMOVED: JwtService import is no longer needed here
import { JwtModule } from '@nestjs/jwt'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, 
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({ // 2. JwtModule is imported here
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
  // 3. 🛑 THE FIX: Export the whole JwtModule, not just the service
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}