import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    submitReview(req: any, createReviewDto: CreateReviewDto, file: any): Promise<{
        user: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
    }>;
    getProductReviews(productId: string): Promise<({
        user: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
    })[]>;
}
