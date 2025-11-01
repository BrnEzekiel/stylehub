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
        user_id: string;
        doc_type: string;
        doc_url: string;
        selfie_url: string;
        status: import(".prisma/client").$Enums.KycStatus;
    } | {
        status: string;
    }>;
    submitKyc(req: any, submitKycDto: SubmitKycDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user_id: string;
        doc_type: string;
        doc_url: string;
        selfie_url: string;
        status: import(".prisma/client").$Enums.KycStatus;
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
        user_id: string;
        doc_type: string;
        doc_url: string;
        selfie_url: string;
        status: import(".prisma/client").$Enums.KycStatus;
    })[]>;
    updateKycStatus(id: string, updateKycStatusDto: UpdateKycStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user_id: string;
        doc_type: string;
        doc_url: string;
        selfie_url: string;
        status: import(".prisma/client").$Enums.KycStatus;
    }>;
}
