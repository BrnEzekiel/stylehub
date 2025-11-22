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
exports.ProviderPortfolioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let ProviderPortfolioService = class ProviderPortfolioService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async getPortfolioStatus(userId) {
        const portfolio = await this.prisma.providerPortfolio.findUnique({
            where: { userId },
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('Portfolio not found');
        }
        return portfolio;
    }
    async submitPortfolio(userId, dto, videoFile) {
        const existing = await this.prisma.providerPortfolio.findUnique({
            where: { userId },
        });
        if (existing && (existing.status === 'pending' || existing.status === 'verified')) {
            throw new common_1.ConflictException(`Your portfolio is already ${existing.status}.`);
        }
        let videoUrl = null;
        if (videoFile) {
            try {
                const uploadResult = await this.storageService.upload(videoFile.buffer, 'portfolio-videos');
                videoUrl = uploadResult?.secure_url || null;
            }
            catch (error) {
                console.error('Video upload failed:', error);
                throw new common_1.InternalServerErrorException('Failed to upload video pitch.');
            }
        }
        const data = {
            userId,
            bio: dto.bio,
            portfolioUrl: dto.portfolioUrl,
            videoUrl,
            status: client_1.VerificationStatus.pending,
        };
        return this.prisma.providerPortfolio.upsert({
            where: { userId },
            update: data,
            create: data,
        });
    }
    async getPendingPortfolios() {
        return this.prisma.providerPortfolio.findMany({
            where: { status: client_1.VerificationStatus.pending },
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async updatePortfolioStatus(portfolioId, status) {
        const portfolio = await this.prisma.providerPortfolio.findUnique({
            where: { id: portfolioId },
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('Portfolio submission not found');
        }
        return this.prisma.providerPortfolio.update({
            where: { id: portfolioId },
            data: { status },
        });
    }
};
exports.ProviderPortfolioService = ProviderPortfolioService;
exports.ProviderPortfolioService = ProviderPortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ProviderPortfolioService);
//# sourceMappingURL=provider-portfolio.service.js.map