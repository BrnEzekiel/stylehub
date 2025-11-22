import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { KycStatus } from '@prisma/client';
export declare class KycService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    getStatus(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        docType: string;
        docUrl: string;
        selfieUrl: string;
        status: import(".prisma/client").$Enums.KycStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    } | {
        status: string;
    }>;
    submitKyc(userId: string, doc_type: string, docFile: any, selfieFile: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        docType: string;
        docUrl: string;
        selfieUrl: string;
        status: import(".prisma/client").$Enums.KycStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }>;
    getPendingSubmissions(): Promise<({
        user: {
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        docType: string;
        docUrl: string;
        selfieUrl: string;
        status: import(".prisma/client").$Enums.KycStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    })[]>;
    updateKycStatus(kycId: string, status: KycStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        docType: string;
        docUrl: string;
        selfieUrl: string;
        status: import(".prisma/client").$Enums.KycStatus;
        remarks: string | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }>;
}
