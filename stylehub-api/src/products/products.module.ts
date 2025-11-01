// src/products/products.module.ts

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SearchModule } from '../search/search.module'; // 🛑 THIS IMPORT MUST BE PRESENT 🛑
import { StorageModule } from '../storage/storage.module'; // Corrected path

@Module({
  imports: [PrismaModule, StorageModule, SearchModule], // 🛑 AND SearchModule MUST BE HERE 🛑
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}