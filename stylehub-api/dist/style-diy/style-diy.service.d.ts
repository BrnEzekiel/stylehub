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
        _count: {
            comments: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        productId: string | null;
        userId: string;
        serviceId: string | null;
        videoUrl: string | null;
        title: string;
        content: string | null;
        likes: number;
    }>;
    getAllPosts(page?: number, limit?: number): Promise<{
        posts: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
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
                content: string;
                postId: string;
            })[];
            recommendations: ({
                user: {
                    name: string;
                    email: string;
                    id: string;
                };
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
            } & {
                id: string;
                createdAt: Date;
                sellerId: string | null;
                productId: string | null;
                userId: string;
                comment: string | null;
                serviceId: string | null;
                providerId: string | null;
                postId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            productId: string | null;
            userId: string;
            serviceId: string | null;
            videoUrl: string | null;
            title: string;
            content: string | null;
            likes: number;
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
            content: string;
            postId: string;
        })[];
        recommendations: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
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
        } & {
            id: string;
            createdAt: Date;
            sellerId: string | null;
            productId: string | null;
            userId: string;
            comment: string | null;
            serviceId: string | null;
            providerId: string | null;
            postId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        productId: string | null;
        userId: string;
        serviceId: string | null;
        videoUrl: string | null;
        title: string;
        content: string | null;
        likes: number;
    }>;
    likePost(postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        productId: string | null;
        userId: string;
        serviceId: string | null;
        videoUrl: string | null;
        title: string;
        content: string | null;
        likes: number;
    }>;
    addComment(postId: string, userId: string, dto: CreateCommentDto): Promise<{
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
        content: string;
        postId: string;
    }>;
    addRecommendation(postId: string, userId: string, dto: CreateRecommendationDto): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
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
    } & {
        id: string;
        createdAt: Date;
        sellerId: string | null;
        productId: string | null;
        userId: string;
        comment: string | null;
        serviceId: string | null;
        providerId: string | null;
        postId: string;
    }>;
    deletePost(postId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        productId: string | null;
        userId: string;
        serviceId: string | null;
        videoUrl: string | null;
        title: string;
        content: string | null;
        likes: number;
    }>;
}
