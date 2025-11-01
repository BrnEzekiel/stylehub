// src/reviews/reviews.module.ts
import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Import PrismaModule

@Module({
  imports: [PrismaModule], // 2. Add PrismaModule here
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}