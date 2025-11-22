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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let ServicesService = class ServicesService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async create(providerId, dto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Service image file is required.');
        }
        const provider = await this.prisma.user.findUnique({
            where: { id: providerId },
            include: { kyc: true, providerPortfolio: true },
        });
        if (!provider ||
            provider.kyc?.status !== 'approved' ||
            provider.providerPortfolio?.status !== 'verified') {
            throw new common_1.ForbiddenException('You must have approved KYC and an approved Portfolio to create a service.');
        }
        let imageUrl;
        try {
            const uploadResult = await this.storageService.upload(file.buffer, 'services');
            if (!uploadResult?.secure_url) {
                throw new Error('Image upload failed to return a secure URL.');
            }
            imageUrl = uploadResult.secure_url;
        }
        catch (error) {
            console.error('Service image upload failed:', error);
            throw new common_1.InternalServerErrorException('Failed to upload service image.');
        }
        const data = {
            title: dto.title,
            description: dto.description,
            category: dto.category,
            priceShopCents: new client_1.Prisma.Decimal(dto.priceShopCents),
            priceHomeCents: dto.priceHomeCents
                ? new client_1.Prisma.Decimal(dto.priceHomeCents)
                : null,
            offersHome: dto.offersHome,
            durationMinutes: dto.durationMinutes,
            imageUrl: imageUrl,
            provider: {
                connect: { id: providerId },
            },
        };
        return this.prisma.service.create({ data });
    }
    async findByProvider(providerId) {
        return this.prisma.service.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAll(category) {
        const where = {
            provider: {
                kyc: { status: 'approved' },
                providerPortfolio: { status: 'verified' },
            },
        };
        if (category) {
            where.category = category;
        }
        return this.prisma.service.findMany({
            where,
            include: {
                provider: {
                    select: { name: true, verificationStatus: true },
                },
            },
        });
    }
    async findOne(serviceId) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        verificationStatus: true,
                        providerPortfolio: true,
                    },
                },
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ServicesService);
//# sourceMappingURL=services.service.js.map