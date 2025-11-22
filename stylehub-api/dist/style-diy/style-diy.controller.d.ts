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
    getAllPosts(page?: string, limit?: string): Promise<{
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
    getPostById(id: string): Promise<{
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
    likePost(id: string): Promise<{
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
        status: string;
        content: string;
        likeCount: number;
        postId: string;
        parentId: string | null;
    }>;
    addRecommendation(req: any, id: string, dto: CreateRecommendationDto): Promise<{
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
    deletePost(req: any, id: string): Promise<{
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
