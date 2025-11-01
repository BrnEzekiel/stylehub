// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Import PrismaModule

@Module({
  imports: [PrismaModule], // 2. Add PrismaModule here
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}