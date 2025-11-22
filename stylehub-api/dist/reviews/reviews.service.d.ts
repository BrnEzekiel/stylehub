import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { StorageService } from '../storage/storage.service';
export declare class ReviewsService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    createReview(userId: string, dto: CreateReviewDto, file: any): Promise<{
        user: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        rating: number;
        productId: string;
        comment: string | null;
    }>;
    findReviewsByProductId(productId: string): Promise<({
        user: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        imageUrl: string | null;
        rating: number;
        productId: string;
        comment: string | null;
    })[]>;
}
