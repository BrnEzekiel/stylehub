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
exports.StyleDIYService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let StyleDIYService = class StyleDIYService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async createPost(userId, dto, imageFile, videoFile) {
        let imageUrl;
        let videoUrl;
        if (imageFile) {
            const uploadResult = await this.storageService.upload(imageFile.buffer, 'style-diy-images', 'image');
            imageUrl = uploadResult.secure_url;
        }
        if (videoFile) {
            const uploadResult = await this.storageService.upload(videoFile.buffer, 'style-diy-videos', 'video');
            videoUrl = uploadResult.secure_url;
        }
        return this.prisma.styleDIYPost.create({
            data: {
                userId,
                title: dto.title,
                content: dto.content,
                videoUrl: videoUrl || dto.videoUrl,
                imageUrl: imageUrl || dto.imageUrl,
                productId: dto.productId,
                serviceId: dto.serviceId,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, imageUrl: true } },
                service: { select: { id: true, title: true, imageUrl: true } },
                _count: { select: { comments: true } },
            },
        });
    }
    async getAllPosts(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [posts, total] = await Promise.all([
            this.prisma.styleDIYPost.findMany({
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    product: { select: { id: true, name: true, imageUrl: true } },
                    service: { select: { id: true, title: true, imageUrl: true } },
                    comments: {
                        include: {
                            user: { select: { id: true, name: true, email: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 5,
                    },
                    recommendations: {
                        include: {
                            user: { select: { id: true, name: true, email: true } },
                            seller: { select: { id: true, name: true, email: true } },
                            provider: { select: { id: true, name: true, email: true } },
                            product: { select: { id: true, name: true, imageUrl: true } },
                            service: { select: { id: true, title: true, imageUrl: true } },
                        },
                    },
                    _count: { select: { comments: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.styleDIYPost.count(),
        ]);
        return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getPostById(postId) {
        const post = await this.prisma.styleDIYPost.findUnique({
            where: { id: postId },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, imageUrl: true } },
                service: { select: { id: true, title: true, imageUrl: true } },
                comments: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                recommendations: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        seller: { select: { id: true, name: true, email: true } },
                        provider: { select: { id: true, name: true, email: true } },
                        product: { select: { id: true, name: true, imageUrl: true } },
                        service: { select: { id: true, title: true, imageUrl: true } },
                    },
                },
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found.');
        }
        return post;
    }
    async likePost(postId) {
        const post = await this.prisma.styleDIYPost.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found.');
        }
        return this.prisma.styleDIYPost.update({
            where: { id: postId },
            data: { likes: { increment: 1 } },
        });
    }
    async addComment(postId, userId, dto) {
        const post = await this.prisma.styleDIYPost.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found.');
        }
        return this.prisma.styleDIYComment.create({
            data: {
                postId,
                userId,
                content: dto.content,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async addRecommendation(postId, userId, dto) {
        const post = await this.prisma.styleDIYPost.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found.');
        }
        if (!dto.sellerId && !dto.providerId && !dto.productId && !dto.serviceId) {
            throw new common_1.BadRequestException('At least one recommendation target is required.');
        }
        return this.prisma.styleDIYRecommendation.create({
            data: {
                postId,
                userId,
                sellerId: dto.sellerId,
                providerId: dto.providerId,
                productId: dto.productId,
                serviceId: dto.serviceId,
                comment: dto.comment,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                seller: { select: { id: true, name: true, email: true } },
                provider: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, imageUrl: true } },
                service: { select: { id: true, title: true, imageUrl: true } },
            },
        });
    }
    async deletePost(postId, userId) {
        const post = await this.prisma.styleDIYPost.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found.');
        }
        if (post.userId !== userId) {
            throw new common_1.BadRequestException('You can only delete your own posts.');
        }
        return this.prisma.styleDIYPost.delete({
            where: { id: postId },
        });
    }
};
exports.StyleDIYService = StyleDIYService;
exports.StyleDIYService = StyleDIYService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], StyleDIYService);
//# sourceMappingURL=style-diy.service.js.map