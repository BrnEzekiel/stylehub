import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Prisma } from '@prisma/client';
export declare class ServicesService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    create(providerId: string, dto: CreateServiceDto, file: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        isActive: boolean;
        title: string;
        providerId: string;
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
        portfolioId: string | null;
    }>;
    findByProvider(providerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        isActive: boolean;
        title: string;
        providerId: string;
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
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
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
        portfolioId: string | null;
    })[]>;
    findOne(serviceId: string): Promise<{
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
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
        portfolioId: string | null;
    }>;
}
