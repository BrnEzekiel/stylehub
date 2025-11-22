import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';

@Injectable()
export class StyleDIYService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async createPost(userId: string, dto: CreatePostDto, imageFile?: any, videoFile?: any) {
    let imageUrl: string | undefined;
    let videoUrl: string | undefined; // This variable exists but isn't used in your schema

    // Upload image if provided
    if (imageFile) {
      const uploadResult = await this.storageService.upload(
        imageFile.buffer,
        'style-diy-images',
        'image',
      );
      imageUrl = uploadResult.secure_url;
    }

    // Upload video if provided
    if (videoFile) {
      const uploadResult = await this.storageService.upload(
        videoFile.buffer,
        'style-diy-videos',
        'video',
      );
      videoUrl = uploadResult.secure_url; // Note: 'videoUrl' is not in your StyleDIYPost schema
    }

    // --- FIX: The data block must match your schema ---
    const imageInput = imageUrl || dto.imageUrl;

    return this.prisma.styleDIYPost.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content,
        // FIX 1: 'imageUrls' is an array in your schema
        imageUrls: imageInput ? [imageInput] : [],
        // FIX 2: Products and services are relations, not direct fields
        products: dto.productId
          ? {
              create: { productId: dto.productId },
            }
          : undefined,
        services: dto.serviceId
          ? {
              create: { serviceId: dto.serviceId },
            }
          : undefined,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        // FIX 3: Needs a nested select to get product details
        products: {
          select: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
        services: { // Renamed 'service' to 'services' to match schema
          select: {
            service: { // Added nested select
              select: { id: true, title: true, imageUrl: true },
            }
          }
        },
        _count: { select: { comments: true } },
      },
    });
  }

  async getAllPosts(page = 1, limit = 20, postId?: string) {
    const skip = (page - 1) * limit;

    const where = postId ? { id: postId } : {};

    const [posts, total] = await Promise.all([
      this.prisma.styleDIYPost.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          // FIX 4: 'product' -> 'products' and nested select
          products: {
            select: {
              product: {
                select: { id: true, name: true, imageUrl: true },
              },
            },
          },
          services: { // Renamed 'service' to 'services'
            select: {
              service: { // Added nested select
                select: { id: true, title: true, imageUrl: true },
              }
            }
          },
          comments: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          recommendations: {
            include: {
              recommendedBy: { select: { id: true, name: true, email: true } },
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
      this.prisma.styleDIYPost.count({ where }),
    ]);

    return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPostById(postId: string) {
    const post = await this.prisma.styleDIYPost.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        // FIX 5: 'product' -> 'products' and nested select
        products: {
          select: {
            product: {
              select: { id: true, name: true, imageUrl: true },
            },
          },
        },
        services: { // Renamed 'service' to 'services'
          select: {
            service: { // Added nested select
              select: { id: true, title: true, imageUrl: true },
            }
          }
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        recommendations: {
          include: {
            recommendedBy: { select: { id: true, name: true, email: true } },
            seller: { select: { id: true, name: true, email: true } },
            provider: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, name: true, imageUrl: true } },
            service: { select: { id: true, title: true, imageUrl: true } },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  async likePost(postId: string) {
    const post = await this.prisma.styleDIYPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return this.prisma.styleDIYPost.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });
  }

  async addComment(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
    parentCommentId: string | null = null,
  ) {
    const post = await this.prisma.styleDIYPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return this.prisma.styleDIYComment.create({
      data: {
        postId,
        userId,
        content: dto.content,
        parentId: parentCommentId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async addRecommendation(postId: string, userId: string, dto: CreateRecommendationDto) {
    const post = await this.prisma.styleDIYPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    // Validate that at least one recommendation target is provided
    if (!dto.sellerId && !dto.providerId && !dto.productId && !dto.serviceId) {
      throw new BadRequestException('At least one recommendation target is required.');
    }

    return this.prisma.styleDIYRecommendation.create({
      data: {
        postId,
        recommendedById: userId, // FIX 6: Use 'userId' from function params
        sellerId: dto.sellerId,
        providerId: dto.providerId,
        productId: dto.productId,
        serviceId: dto.serviceId,
        comment: dto.comment,
      },
      include: {
        recommendedBy: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
        provider: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, imageUrl: true } },
        service: { select: { id: true, title: true, imageUrl: true } },
      },
    });
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.styleDIYPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (post.userId !== userId) {
      throw new BadRequestException('You can only delete your own posts.');
    }

    return this.prisma.styleDIYPost.delete({
      where: { id: postId },
    });
  }
}