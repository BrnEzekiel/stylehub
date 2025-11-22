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
exports.StaysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs_1.unlink);
let StaysService = class StaysService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateOwnership(userId, stayId) {
        const stay = await this.prisma.stay.findUnique({
            where: { id: stayId },
            select: { ownerId: true },
        });
        if (!stay) {
            throw new common_1.NotFoundException('Stay not found');
        }
        if (stay.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to modify this stay');
        }
    }
    async create(userId, createStayDto, files) {
        const { amenities, ...stayData } = createStayDto;
        const stay = await this.prisma.$transaction(async (prisma) => {
            const createdStay = await prisma.stay.create({
                data: {
                    ...stayData,
                    ownerId: userId,
                    images: {
                        create: files.map((file, index) => ({
                            url: `/uploads/stays/${file.filename}`,
                            isPrimary: index === 0,
                        })),
                    },
                },
                include: {
                    images: true,
                },
            });
            if (amenities && amenities.length > 0) {
                await prisma.stayAmenity.createMany({
                    data: amenities.map((type) => ({
                        stayId: createdStay.id,
                        type,
                        isAvailable: true,
                    })),
                    skipDuplicates: true,
                });
            }
            return createdStay;
        });
        return this.prisma.stay.findUnique({
            where: { id: stay.id },
            include: {
                images: true,
                amenities: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
    }
    async findAll(params) {
        const { city, minPrice, maxPrice, type, page, limit } = params;
        const skip = (page - 1) * limit;
        const where = {
            isAvailable: true,
        };
        if (city)
            where.city = { contains: city, mode: 'insensitive' };
        if (type)
            where.type = type;
        if (minPrice)
            where.pricePerMonth = { gte: minPrice };
        if (maxPrice)
            where.pricePerMonth = { ...where.pricePerMonth, lte: maxPrice };
        const [stays, total] = await Promise.all([
            this.prisma.stay.findMany({
                where,
                skip,
                take: limit,
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                    _count: {
                        select: { reviews: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.stay.count({ where }),
        ]);
        return {
            data: stays,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async search(query, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {
            isAvailable: true,
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { address: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
            ],
        };
        const [stays, total] = await Promise.all([
            this.prisma.stay.findMany({
                where,
                skip,
                take: limit,
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                    _count: {
                        select: { reviews: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.stay.count({ where }),
        ]);
        return {
            data: stays,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const stay = await this.prisma.stay.findUnique({
            where: { id },
            include: {
                images: true,
                amenities: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                _count: {
                    select: { reviews: true },
                },
            },
        });
        if (!stay) {
            throw new common_1.NotFoundException('Stay not found');
        }
        return stay;
    }
    async findByOwner(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [stays, total] = await Promise.all([
            this.prisma.stay.findMany({
                where: { ownerId: userId },
                skip,
                take: limit,
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                    _count: {
                        select: { bookings: true, reviews: true },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.stay.count({ where: { ownerId: userId } }),
        ]);
        return {
            data: stays,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async update(userId, id, updateStayDto) {
        await this.validateOwnership(userId, id);
        const { amenities, ...updateData } = updateStayDto;
        return this.prisma.$transaction(async (prisma) => {
            const updatedStay = await prisma.stay.update({
                where: { id },
                data: updateData,
            });
            if (amenities && Array.isArray(amenities)) {
                await prisma.stayAmenity.deleteMany({
                    where: { stayId: id },
                });
                if (amenities.length > 0) {
                    await prisma.stayAmenity.createMany({
                        data: amenities.map((type) => ({
                            stayId: id,
                            type,
                            isAvailable: true,
                        })),
                    });
                }
            }
            return this.prisma.stay.findUnique({
                where: { id },
                include: {
                    images: true,
                    amenities: true,
                },
            });
        });
    }
    async remove(userId, id) {
        await this.validateOwnership(userId, id);
        const stay = await this.prisma.stay.findUnique({
            where: { id },
            include: { images: true },
        });
        await this.prisma.stay.delete({
            where: { id },
        });
        if (stay?.images?.length > 0) {
            await Promise.all(stay.images.map((image) => {
                const filePath = (0, path_1.join)(process.cwd(), 'public', image.url);
                if ((0, fs_1.existsSync)(filePath)) {
                    return unlinkAsync(filePath).catch(console.error);
                }
                return Promise.resolve();
            }));
        }
        return { message: 'Stay deleted successfully' };
    }
    async addImages(userId, stayId, files) {
        await this.validateOwnership(userId, stayId);
        const stay = await this.prisma.stay.findUnique({
            where: { id: stayId },
            select: { id: true },
        });
        if (!stay) {
            throw new common_1.NotFoundException('Stay not found');
        }
        await this.prisma.stayImage.createMany({
            data: files.map((file) => ({
                stayId,
                url: `/uploads/stays/${file.filename}`,
                isPrimary: false,
            })),
        });
        return this.prisma.stayImage.findMany({
            where: { stayId },
            orderBy: { isPrimary: 'desc' },
        });
    }
    async setPrimaryImage(userId, stayId, imageId) {
        await this.validateOwnership(userId, stayId);
        const image = await this.prisma.stayImage.findUnique({
            where: { id: imageId },
            select: { id: true, stayId: true },
        });
        if (!image || image.stayId !== stayId) {
            throw new common_1.NotFoundException('Image not found');
        }
        return this.prisma
            .$transaction([
            this.prisma.stayImage.updateMany({
                where: { stayId },
                data: { isPrimary: false },
            }),
            this.prisma.stayImage.update({
                where: { id: imageId },
                data: { isPrimary: true },
            }),
        ])
            .then(([, primaryImage]) => primaryImage);
    }
    async removeImage(userId, stayId, imageId) {
        await this.validateOwnership(userId, stayId);
        const image = await this.prisma.stayImage.findUnique({
            where: { id: imageId },
            select: { id: true, stayId: true, url: true, isPrimary: true },
        });
        if (!image || image.stayId !== stayId) {
            throw new common_1.NotFoundException('Image not found');
        }
        const imageCount = await this.prisma.stayImage.count({
            where: { stayId },
        });
        if (imageCount <= 1) {
            throw new common_1.BadRequestException('Cannot delete the only image of a stay');
        }
        await this.prisma.stayImage.delete({
            where: { id: imageId },
        });
        const filePath = (0, path_1.join)(process.cwd(), 'public', image.url);
        if ((0, fs_1.existsSync)(filePath)) {
            await unlinkAsync(filePath).catch(console.error);
        }
        if (image.isPrimary) {
            const nextImage = await this.prisma.stayImage.findFirst({
                where: { stayId, id: { not: imageId } },
                orderBy: { createdAt: 'asc' },
            });
            if (nextImage) {
                await this.prisma.stayImage.update({
                    where: { id: nextImage.id },
                    data: { isPrimary: true },
                });
            }
        }
        return { message: 'Image deleted successfully' };
    }
};
exports.StaysService = StaysService;
exports.StaysService = StaysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaysService);
//# sourceMappingURL=stays.service.js.map