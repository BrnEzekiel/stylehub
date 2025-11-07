import { ProviderPortfolioService } from './provider-portfolio.service';
import { SubmitPortfolioDto } from './dto/submit-portfolio.dto';
import { UpdateVerificationStatusDto } from '../verification/dto/update-verification.dto';
export declare class ProviderPortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: ProviderPortfolioService);
    getPortfolioStatus(req: any): Promise<{
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
    submitPortfolio(req: any, dto: SubmitPortfolioDto, videoFile: any): Promise<{
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
    updatePortfolioStatus(id: string, dto: UpdateVerificationStatusDto): Promise<{
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
