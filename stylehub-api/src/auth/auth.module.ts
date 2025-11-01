import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'; // <-- 1. ADD THIS IMPORT
import { JwtStrategy } from './strategies/jwt.strategy'; // <-- 2. ADD THIS IMPORT
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy'; // <-- 3. ADD THIS IMPORT

@Module({
  imports: [
    UsersModule, // Import UsersModule to use UsersService
    ConfigModule, // Needed to access .env variables
    PassportModule, // <-- 4. ADD THIS MODULE
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // We set the factory here but will specify secrets in the service
        // This is just to get the module configured
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy, // <-- 5. ADD THIS PROVIDER
    RefreshJwtStrategy, // <-- 6. ADD THIS PROVIDER
  ],
  controllers: [AuthController],
})
export class AuthModule {}