// src/reviews/reviews.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors, // 1. 🛑 Import
  UploadedFile, // 2. 🛑 Import
} from '@nestjs/common';
import { FileInterceptor } from '@nest-lab/fastify-multer'; // 3. 🛑 Import
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * 🛑 UPDATED: Endpoint for Clients to submit a review with an optional image.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Client)
  @UseInterceptors(FileInterceptor('image')) // 4. 🛑 Handle 'image' field
  async submitReview(
    @Request() req,
    @Body() createReviewDto: CreateReviewDto,
    @UploadedFile() file: any, // 5. 🛑 Get the uploaded file
  ) {
    const userId = req.user.sub;
    // 6. 🛑 Pass the file to the service
    return this.reviewsService.createReview(userId, createReviewDto, file);
  }

  /**
   * Endpoint to get all reviews for a specific product.
   */
  @Get('product/:productId')
  async getProductReviews(
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.reviewsService.findReviewsByProductId(productId);
  }
}