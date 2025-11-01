// src/reviews/reviews.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 🛑 MODIFIED FUNCTION 🛑
   * Creates a review AND updates the product's average rating in a transaction.
   */
  async createReview(userId: string, dto: CreateReviewDto) {
    const { productId, rating, comment } = dto;

    try {
      // --- Optional (Recommended): Check if user purchased the product ---
      /*
      const orderItem = await this.prisma.orderItem.findFirst({
        where: {
          productId: dto.productId,
          order: {
            userId: userId,
            status: 'paid', // Or 'completed' depending on your flow
          },
        },
      });
      if (!orderItem) {
        throw new ForbiddenException('You can only review products you have purchased.');
      }
      */
      // --- End Optional Purchase Check ---

      // --- Your existing check (this is great) ---
      const existingReview = await this.prisma.review.findUnique({
        where: {
          userId_productId: { // Compound unique index in schema.prisma
            userId: userId,
            productId: productId,
          },
        },
      });

      if (existingReview) {
        throw new ConflictException('You have already reviewed this product.');
      }

      // --- NEW: Transaction Logic ---
      // We do two things at once: create the review AND update the product.
      const [newReview] = await this.prisma.$transaction(async (tx) => {
        
        // 1. Create the new review (using your DTO field 'comment')
        const review = await tx.review.create({
          data: {
            rating: rating,
            comment: comment,
            productId: productId,
            userId: userId,
          },
          include: {
            user: { select: { name: true } },
          },
        });

        // 2. Calculate the new average rating for the product
        const stats = await tx.review.aggregate({
          where: { productId: productId },
          _avg: { rating: true },
        });

        const newAverage = stats._avg.rating || 0;

        // 3. Update the Product's averageRating field
        await tx.product.update({
          where: { id: productId },
          data: {
            averageRating: new Prisma.Decimal(newAverage),
          },
        });

        return [review]; // Return the newly created review
      });
      
      return newReview;

    } catch (error) {
      // --- Your existing error handling (this is great) ---
      console.error(`Error creating review for product ${dto.productId} by user ${userId}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle foreign key constraint error (e.g., product doesn't exist)
        if (error.code === 'P2003' || error.code === 'P2025') {
          throw new NotFoundException(`Product with ID ${dto.productId} not found.`);
        }
      }
      if (error instanceof ConflictException || error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error; // Re-throw specific handled errors
      }
      throw new InternalServerErrorException('Could not submit review.');
    }
  }

  /**
   * 🛑 UNCHANGED FUNCTION 🛑
   * This function was already correct.
   */
  async findReviewsByProductId(productId: string) {
    try {
      return await this.prisma.review.findMany({
        where: {
          productId: productId,
        },
        orderBy: {
          createdAt: 'desc', // Show newest reviews first
        },
        include: { // Include user's name with each review
          user: {
            select: { name: true },
          },
        },
      });
    } catch (error) {
      console.error(`Error finding reviews for product ${productId}:`, error);
      throw new InternalServerErrorException('Could not retrieve reviews.');
    }
  }
}