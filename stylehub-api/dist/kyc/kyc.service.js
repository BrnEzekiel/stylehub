"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let KycService = class KycService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async getStatus(userId) {
        const kyc = await this.prisma.kYC.findUnique({
            where: { userId: userId },
        });
        if (!kyc) {
            return { status: 'not_submitted' };
        }
        return kyc;
    }
    async submitKyc(userId, doc_type, docFile, selfieFile) {
        const existingKyc = await this.prisma.kYC.findUnique({
            where: { userId: userId },
        });
        if (existingKyc && existingKyc.status === 'approved') {
            throw new common_1.ConflictException('KYC is already approved.');
        }
        if (existingKyc && existingKyc.status === 'pending') {
            throw new common_1.ConflictException('You already have a KYC submission pending review.');
        }
        let doc_url;
        let selfie_url;
        try {
            const [docUpload, selfieUpload] = await Promise.all([
                this.storageService.upload(docFile.buffer, 'kyc_documents'),
                this.storageService.upload(selfieFile.buffer, 'kyc_selfies'),
            ]);
            if (!docUpload?.secure_url || !selfieUpload?.secure_url) {
                throw new common_1.InternalServerErrorException('File upload failed to return a secure URL.');
            }
            doc_url = docUpload.secure_url;
            selfie_url = selfieUpload.secure_url;
        }
        catch (error) {
            console.error('KYC File Upload Error:', error);
            throw new common_1.InternalServerErrorException('Failed to upload KYC files.');
        }
        const kycUpdateData = {
            docType: doc_type,
            docUrl: doc_url,
            selfieUrl: selfie_url,
            status: client_1.KycStatus.pending,
            reviewedAt: null,
            remarks: null,
        };
        const kycCreateData = {
            userId: userId,
            docType: doc_type,
            docUrl: doc_url,
            selfieUrl: selfie_url,
            status: client_1.KycStatus.pending,
        };
        try {
            const updatedKyc = await this.prisma.kYC.upsert({
                where: { userId: userId },
                update: kycUpdateData,
                create: kycCreateData,
            });
            return updatedKyc;
        }
        catch (error) {
            console.error(`Failed to submit KYC for user ${userId}:`, error);
            throw new common_1.InternalServerErrorException('Could not submit KYC details.');
        }
    }
    async getPendingSubmissions() {
        return this.prisma.kYC.findMany({
            where: { status: client_1.KycStatus.pending },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async updateKycStatus(kycId, status) {
        const kycRecord = await this.prisma.kYC.findUnique({
            where: { id: kycId },
        });
        if (!kycRecord) {
            throw new common_1.NotFoundException('KYC record not found');
        }
        const updatedKyc = await this.prisma.kYC.update({
            where: { id: kycId },
            data: { status: status },
        });
        return updatedKyc;
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], KycService);
//# sourceMappingURL=kyc.service.js.map