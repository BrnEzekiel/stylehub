// src/verification/verification.module.ts

import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, AuthModule, StorageModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
// 🛑 THE FIX: Added 'export' here.
export class VerificationModule {}