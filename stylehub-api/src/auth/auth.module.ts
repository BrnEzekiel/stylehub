// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt'; // 1. JwtModule is imported
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module'; // 2. We also need PrismaModule

@Module({
  imports: [
    PrismaModule, // 3. Add PrismaModule here
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({ // 4. JwtModule is registered
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
  // 5. 🛑 THE FIX: Export the entire JwtModule, not just the service
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}