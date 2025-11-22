import { ProviderPortfolioService } from './provider-portfolio.service';
import { SubmitPortfolioDto } from './dto/submit-portfolio.dto';
import { UpdateProviderPortfolioStatusDto } from './dto/update-provider-portfolio-status.dto';
export declare class ProviderPortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: ProviderPortfolioService);
    getPortfolioStatus(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        bio: string | null;
        portfolioUrl: string | null;
        videoUrl: string | null;
    }>;
    submitPortfolio(req: any, dto: SubmitPortfolioDto, videoFile: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        bio: string | null;
        portfolioUrl: string | null;
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
        userId: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        bio: string | null;
        portfolioUrl: string | null;
        videoUrl: string | null;
    })[]>;
    updatePortfolioStatus(id: string, dto: UpdateProviderPortfolioStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.VerificationStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
        bio: string | null;
        portfolioUrl: string | null;
        videoUrl: string | null;
    }>;
}
