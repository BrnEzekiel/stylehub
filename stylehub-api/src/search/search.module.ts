// src/search/search.module.ts

import { Module } from '@nestjs/common';
import { SearchService } from './search.service';

@Module({
  providers: [SearchService],
  exports: [SearchService], // 🛑 THIS LINE IS THE FIX 🛑
})
export class SearchModule {}