// src/withdrawal-admin/withdrawal-admin.module.ts

import { Module } from '@nestjs/common';
import { WithdrawalAdminService } from './withdrawal-admin.service';
import { WithdrawalAdminController } from './withdrawal-admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [WithdrawalAdminService],
  controllers: [WithdrawalAdminController],
})
export class WithdrawalAdminModule {}