import { StyleDIYService } from './style-diy.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
export declare class StyleDIYController {
    private readonly styleDIYService;
    constructor(styleDIYService: StyleDIYService);
    createPost(req: any, dto: CreatePostDto, files: {
        image?: any[];
        video?: any[];
    }): Promise<{
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
    getAllPosts(page?: string, limit?: string): Promise<{
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
    getPostById(id: string): Promise<{
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
    likePost(id: string): Promise<{
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
    addComment(req: any, id: string, dto: CreateCommentDto): Promise<{
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
    addRecommendation(req: any, id: string, dto: CreateRecommendationDto): Promise<{
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
    deletePost(req: any, id: string): Promise<{
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
