// src/payouts/payouts.module.ts

import { Module } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { WalletModule } from '../wallet/wallet.module'; // 1. 🛑 Import WalletModule

@Module({
  imports: [PrismaModule, AuthModule, WalletModule], // 2. 🛑 Add WalletModule
  providers: [PayoutsService],
  controllers: [PayoutsController],
})
export class PayoutsModule {}