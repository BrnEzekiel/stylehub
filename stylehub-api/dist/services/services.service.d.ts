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
        providerId: string;
        title: string;
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
    }>;
    findByProvider(providerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        category: string;
        imageUrl: string | null;
        providerId: string;
        title: string;
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
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
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
    })[]>;
    findOne(serviceId: string): Promise<{
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
        priceShopCents: Prisma.Decimal;
        priceHomeCents: Prisma.Decimal | null;
        offersHome: boolean;
        durationMinutes: number;
    }>;
}
