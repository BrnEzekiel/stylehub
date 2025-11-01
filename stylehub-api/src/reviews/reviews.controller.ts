// src/reviews/reviews.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreateReviewDto } from './dto/create-review.dto';

// Define the base route for reviews
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Endpoint for Clients to submit a review for a product.
   */
  @Post() // Handles POST /api/reviews
  @UseGuards(JwtAuthGuard, RolesGuard) // Requires login and role check
  @Roles(Role.Client) // Only Clients can submit reviews
  async submitReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user.sub; // Get userId from the authenticated user token
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  /**
   * Endpoint to get all reviews for a specific product.
   * NOTE: This could also logically live in ProductsController as GET /api/products/:productId/reviews
   * Putting it here for simplicity now.
   */
  @Get('product/:productId') // Handles GET /api/reviews/product/:productId
  async getProductReviews(
    @Param('productId', ParseUUIDPipe) productId: string, // Validate that productId is a UUID
  ) {
    return this.reviewsService.findReviewsByProductId(productId);
  }
}