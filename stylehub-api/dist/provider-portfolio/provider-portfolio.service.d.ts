import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { SubmitPortfolioDto } from './dto/submit-portfolio.dto';
import { VerificationStatus } from '@prisma/client';
export declare class ProviderPortfolioService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    getPortfolioStatus(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VerificationStatus;
        userId: string;
        bio: string;
        portfolioUrl: string;
        videoUrl: string | null;
    } | {
        status: "unverified";
    }>;
    submitPortfolio(userId: string, dto: SubmitPortfolioDto, videoFile: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VerificationStatus;
        userId: string;
        bio: string;
        portfolioUrl: string;
        videoUrl: string | null;
    }>;
    getPendingPortfolios(): Promise<({
        user: {
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VerificationStatus;
        userId: string;
        bio: string;
        portfolioUrl: string;
        videoUrl: string | null;
    })[]>;
    updatePortfolioStatus(portfolioId: string, status: VerificationStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VerificationStatus;
        userId: string;
        bio: string;
        portfolioUrl: string;
        videoUrl: string | null;
    }>;
}
