// src/wallet/wallet.module.ts

import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService], // Export the service so PayoutsModule can use it
})
// 🛑 THE FIX: Added 'export' here.
export class WalletModule {}