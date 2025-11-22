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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let VerificationService = class VerificationService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async getVerificationStatus(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                verificationStatus: true,
                verification: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const definitiveStatus = user.verification?.status || user.verificationStatus;
        return {
            status: definitiveStatus,
            submission: user.verification,
        };
    }
    async submitVerification(userId, dto, businessLicenseFile) {
        if (!businessLicenseFile) {
            throw new common_1.BadRequestException('Business license file is required.');
        }
        const existing = await this.prisma.verification.findUnique({
            where: { userId },
        });
        if (existing && (existing.status === 'pending' || existing.status === 'verified')) {
            throw new common_1.ConflictException(`Your submission is already ${existing.status}.`);
        }
        let licenseUrl;
        try {
            const uploadResult = await this.storageService.upload(businessLicenseFile.buffer, 'business-licenses');
            if (!uploadResult?.secure_url) {
                throw new Error('License upload failed to return a secure URL.');
            }
            licenseUrl = uploadResult.secure_url;
        }
        catch (error) {
            console.error('License upload failed:', error);
            throw new common_1.InternalServerErrorException('Failed to upload business license.');
        }
        const data = {
            userId: userId,
            businessName: dto.businessName,
            socialMediaUrl: dto.socialMediaUrl,
            businessLicenseUrl: licenseUrl,
            status: client_1.VerificationStatus.pending,
        };
        const newSubmission = await this.prisma.verification.upsert({
            where: { userId: userId },
            update: data,
            create: data,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { verificationStatus: client_1.VerificationStatus.pending },
        });
        return newSubmission;
    }
    async getPendingVerifications() {
        return this.prisma.verification.findMany({
            where: { status: client_1.VerificationStatus.pending },
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
    async updateVerificationStatus(verificationId, status) {
        const verification = await this.prisma.verification.findUnique({
            where: { id: verificationId },
        });
        if (!verification) {
            throw new common_1.NotFoundException('Verification submission not found');
        }
        const updatedVerification = await this.prisma.verification.update({
            where: { id: verificationId },
            data: { status: status },
        });
        await this.prisma.user.update({
            where: { id: verification.userId },
            data: { verificationStatus: status },
        });
        return updatedVerification;
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map