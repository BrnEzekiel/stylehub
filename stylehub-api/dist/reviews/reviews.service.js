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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(userId, dto) {
        const { productId, rating, comment } = dto;
        try {
            const existingReview = await this.prisma.review.findUnique({
                where: {
                    userId_productId: {
                        userId: userId,
                        productId: productId,
                    },
                },
            });
            if (existingReview) {
                throw new common_1.ConflictException('You have already reviewed this product.');
            }
            const [newReview] = await this.prisma.$transaction(async (tx) => {
                const review = await tx.review.create({
                    data: {
                        rating: rating,
                        comment: comment,
                        productId: productId,
                        userId: userId,
                    },
                    include: {
                        user: { select: { name: true } },
                    },
                });
                const stats = await tx.review.aggregate({
                    where: { productId: productId },
                    _avg: { rating: true },
                });
                const newAverage = stats._avg.rating || 0;
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        averageRating: new client_1.Prisma.Decimal(newAverage),
                    },
                });
                return [review];
            });
            return newReview;
        }
        catch (error) {
            console.error(`Error creating review for product ${dto.productId} by user ${userId}:`, error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003' || error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Product with ID ${dto.productId} not found.`);
                }
            }
            if (error instanceof common_1.ConflictException || error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Could not submit review.');
        }
    }
    async findReviewsByProductId(productId) {
        try {
            return await this.prisma.review.findMany({
                where: {
                    productId: productId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: { name: true },
                    },
                },
            });
        }
        catch (error) {
            console.error(`Error finding reviews for product ${productId}:`, error);
            throw new common_1.InternalServerErrorException('Could not retrieve reviews.');
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map