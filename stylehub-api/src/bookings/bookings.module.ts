// src/bookings/bookings.module.ts

import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { WalletModule } from '../wallet/wallet.module'; // Import wallet

@Module({
  imports: [PrismaModule, AuthModule, WalletModule], // Add WalletModule
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}