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
import { StorageService } from '../storage/storage.service'; // 1. 🛑 Import StorageService

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService, // 2. 🛑 Inject StorageService
  ) {}

  /**
   * 🛑 MODIFIED FUNCTION 🛑
   * Creates a review, uploads an image, and updates the product's average rating.
   */
  async createReview(userId: string, dto: CreateReviewDto, file: any) {
    const { productId, rating, comment } = dto;

    try {
      // --- Optional (Recommended): Check if user purchased the product ---
      // ... (your commented-out purchase check is good) ...

      const existingReview = await this.prisma.review.findUnique({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId,
          },
        },
      });

      if (existingReview) {
        throw new ConflictException('You have already reviewed this product.');
      }

      // --- 3. 🛑 NEW: Image Upload Logic ---
      let imageUrl: string | null = null;
      if (file) {
        try {
          const uploadResult = await this.storageService.upload(
            file.buffer,
            'reviews',
          );
          if (!uploadResult?.secure_url) {
            throw new Error('Image upload failed to return a secure URL.');
          }
          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.error('Review image upload failed:', error);
          throw new InternalServerErrorException('Failed to upload review image.');
        }
      }

      // --- NEW: Transaction Logic ---
      const [newReview] = await this.prisma.$transaction(async (tx) => {
        
        // 4. 🛑 Create the new review
        const review = await tx.review.create({
          data: {
            rating: rating,
            comment: comment,
            imageUrl: imageUrl, // 5. 🛑 Save the image URL
            productId: productId,
            userId: userId,
          },
          include: {
            user: { select: { name: true } },
          },
        });

        // 6. 🛑 Calculate the new average rating
        const stats = await tx.review.aggregate({
          where: { productId: productId },
          _avg: { rating: true },
          _count: { rating: true }, // 7. 🛑 Also get the count
        });

        const newAverage = stats._avg.rating || 0;
        const newReviewCount = stats._count.rating || 0;

        // 8. 🛑 Update the Product's averageRating AND reviewCount
        await tx.product.update({
          where: { id: productId },
          data: {
            averageRating: new Prisma.Decimal(newAverage),
            reviewCount: newReviewCount, // 9. 🛑 Save the new count
          },
        });

        return [review];
      });
      
      return newReview;

    } catch (error) {
      // ... (your existing error handling is perfect) ...
      console.error(`Error creating review for product ${dto.productId} by user ${userId}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003' || error.code === 'P2025') {
          throw new NotFoundException(`Product with ID ${dto.productId} not found.`);
        }
      }
      if (error instanceof ConflictException || error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
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
          createdAt: 'desc',
        },
        include: {
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