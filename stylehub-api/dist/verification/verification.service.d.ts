import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { VerificationStatus } from '@prisma/client';
export declare class VerificationService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    getVerificationStatus(userId: string): Promise<{
        status: import(".prisma/client").$Enums.VerificationStatus;
        submission: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VerificationStatus;
            userId: string;
            businessName: string;
            socialMediaUrl: string | null;
            businessLicenseUrl: string;
        };
    }>;
    submitVerification(userId: string, dto: SubmitVerificationDto, businessLicenseFile: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VerificationStatus;
        userId: string;
        businessName: string;
        socialMediaUrl: string | null;
        businessLicenseUrl: string;
    }>;
    getPendingVerifications(): Promise<({
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
        businessName: string;
        socialMediaUrl: string | null;
        businessLicenseUrl: string;
    })[]>;
    updateVerificationStatus(verificationId: string, status: VerificationStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VerificationStatus;
        userId: string;
        businessName: string;
        socialMediaUrl: string | null;
        businessLicenseUrl: string;
    }>;
}
