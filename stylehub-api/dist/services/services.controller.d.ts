import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(req: any, dto: CreateServiceDto, file: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        isActive: boolean;
        title: string;
        providerId: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
        portfolioId: string | null;
    }>;
    findMyServices(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        isActive: boolean;
        title: string;
        providerId: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
        portfolioId: string | null;
    }[]>;
    findAll(category?: string): Promise<({
        provider: {
            name: string;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        isActive: boolean;
        title: string;
        providerId: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
        portfolioId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        provider: {
            providerPortfolio: {
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
            };
            name: string;
            email: string;
            id: string;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        isActive: boolean;
        title: string;
        providerId: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
        portfolioId: string | null;
    }>;
}
