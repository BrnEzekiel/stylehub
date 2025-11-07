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
        providerId: string;
        title: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
    }>;
    findMyServices(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        providerId: string;
        title: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
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
        providerId: string;
        title: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
    })[]>;
    findOne(id: string): Promise<{
        provider: {
            providerPortfolio: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.VerificationStatus;
                userId: string;
                bio: string;
                portfolioUrl: string;
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
        providerId: string;
        title: string;
        priceShopCents: import("@prisma/client/runtime/library").Decimal;
        priceHomeCents: import("@prisma/client/runtime/library").Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
    }>;
}
