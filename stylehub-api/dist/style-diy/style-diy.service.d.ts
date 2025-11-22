import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
export declare class StyleDIYService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    createPost(userId: string, dto: CreatePostDto, imageFile?: any, videoFile?: any): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        services: {
            service: {
                id: string;
                imageUrl: string;
                title: string;
            };
        }[];
        products: {
            product: {
                name: string;
                id: string;
                imageUrl: string;
            };
        }[];
        _count: {
            comments: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        title: string;
        content: string | null;
        imageUrls: string[];
        isPublic: boolean;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        topic: string | null;
    }>;
    getAllPosts(page?: number, limit?: number, postId?: string): Promise<{
        posts: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
            services: {
                service: {
                    id: string;
                    imageUrl: string;
                    title: string;
                };
            }[];
            products: {
                product: {
                    name: string;
                    id: string;
                    imageUrl: string;
                };
            }[];
            _count: {
                comments: number;
            };
            comments: ({
                user: {
                    name: string;
                    email: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: string;
                content: string;
                likeCount: number;
                postId: string;
                parentId: string | null;
            })[];
            recommendations: ({
                service: {
                    id: string;
                    imageUrl: string;
                    title: string;
                };
                product: {
                    name: string;
                    id: string;
                    imageUrl: string;
                };
                seller: {
                    name: string;
                    email: string;
                    id: string;
                };
                provider: {
                    name: string;
                    email: string;
                    id: string;
                };
                recommendedBy: {
                    name: string;
                    email: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                sellerId: string | null;
                productId: string | null;
                comment: string | null;
                serviceId: string | null;
                providerId: string | null;
                postId: string;
                recommendedById: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            title: string;
            content: string | null;
            imageUrls: string[];
            isPublic: boolean;
            viewCount: number;
            likeCount: number;
            commentCount: number;
            topic: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPostById(postId: string): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        services: {
            service: {
                id: string;
                imageUrl: string;
                title: string;
            };
        }[];
        products: {
            product: {
                name: string;
                id: string;
                imageUrl: string;
            };
        }[];
        comments: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            content: string;
            likeCount: number;
            postId: string;
            parentId: string | null;
        })[];
        recommendations: ({
            service: {
                id: string;
                imageUrl: string;
                title: string;
            };
            product: {
                name: string;
                id: string;
                imageUrl: string;
            };
            seller: {
                name: string;
                email: string;
                id: string;
            };
            provider: {
                name: string;
                email: string;
                id: string;
            };
            recommendedBy: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            sellerId: string | null;
            productId: string | null;
            comment: string | null;
            serviceId: string | null;
            providerId: string | null;
            postId: string;
            recommendedById: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        title: string;
        content: string | null;
        imageUrls: string[];
        isPublic: boolean;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        topic: string | null;
    }>;
    likePost(postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        title: string;
        content: string | null;
        imageUrls: string[];
        isPublic: boolean;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        topic: string | null;
    }>;
    addComment(postId: string, userId: string, dto: CreateCommentDto, parentCommentId?: string | null): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        content: string;
        likeCount: number;
        postId: string;
        parentId: string | null;
    }>;
    addRecommendation(postId: string, userId: string, dto: CreateRecommendationDto): Promise<{
        service: {
            id: string;
            imageUrl: string;
            title: string;
        };
        product: {
            name: string;
            id: string;
            imageUrl: string;
        };
        seller: {
            name: string;
            email: string;
            id: string;
        };
        provider: {
            name: string;
            email: string;
            id: string;
        };
        recommendedBy: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        sellerId: string | null;
        productId: string | null;
        comment: string | null;
        serviceId: string | null;
        providerId: string | null;
        postId: string;
        recommendedById: string;
    }>;
    deletePost(postId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        title: string;
        content: string | null;
        imageUrls: string[];
        isPublic: boolean;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        topic: string | null;
    }>;
}
