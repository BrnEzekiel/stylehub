import { VerificationService } from './verification.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification.dto';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    getVerificationStatus(req: any): Promise<{
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
    submitVerification(req: any, dto: SubmitVerificationDto, businessLicense: any): Promise<{
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
    updateVerificationStatus(id: string, dto: UpdateVerificationStatusDto): Promise<{
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
