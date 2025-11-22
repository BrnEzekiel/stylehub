import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { UpdateKycStatusDto } from './dto/update-kyc.dto';
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    getKycStatus(req: any): Promise<{
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
    submitKyc(req: any, submitKycDto: SubmitKycDto): Promise<{
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
    updateKycStatus(id: string, updateKycStatusDto: UpdateKycStatusDto): Promise<{
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
