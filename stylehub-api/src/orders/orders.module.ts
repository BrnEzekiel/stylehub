// src/orders/orders.module.ts

import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PdfGeneratorService } from './pdf-generator.service'; // 1. Import

@Module({
  imports: [PrismaModule],
  providers: [OrdersService, PdfGeneratorService], // 2. Add PdfGeneratorService
  controllers: [OrdersController],
})
export class OrdersModule {}