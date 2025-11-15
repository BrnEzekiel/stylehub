// src/style-diy/style-diy.module.ts
import { Module } from '@nestjs/common';
import { StyleDIYController } from './style-diy.controller';
import { StyleDIYService } from './style-diy.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [StyleDIYController],
  providers: [StyleDIYService],
  exports: [StyleDIYService],
})
export class StyleDIYModule {}

