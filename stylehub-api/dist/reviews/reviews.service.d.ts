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
        imageUrl: string | null;
        productId: string;
        userId: string;
        rating: number;
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
        imageUrl: string | null;
        productId: string;
        userId: string;
        rating: number;
        comment: string | null;
    })[]>;
}
