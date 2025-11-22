import { PrismaService } from '../prisma/prisma.service';
import { CreateStayDto } from './dto/create-stay.dto';
import { UpdateStayDto } from './dto/update-stay.dto';
import { Prisma, StayType } from '@prisma/client';
export declare class StaysService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateOwnership;
    create(userId: string, createStayDto: CreateStayDto, files: Express.Multer.File[]): Promise<{
        amenities: {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            type: import(".prisma/client").$Enums.AmenityType;
            isAvailable: boolean;
            stayId: string;
            icon: string | null;
        }[];
        owner: {
            name: string;
            email: string;
            phone: string;
            id: string;
        };
        images: {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            width: number | null;
            url: string;
            isPrimary: boolean;
            altText: string | null;
            height: number | null;
            size: number | null;
            mimeType: string | null;
            stayId: string;
        }[];
    } & {
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        reviewCount: number;
        city: string;
        state: string;
        country: string;
        type: import(".prisma/client").$Enums.StayType;
        title: string;
        viewCount: number;
        pricePerMonth: Prisma.Decimal;
        latitude: number | null;
        longitude: number | null;
        maxOccupants: number;
        availableFrom: Date;
        availableTo: Date | null;
        houseRules: string | null;
        cancellationPolicy: string | null;
        checkInTime: string | null;
        checkOutTime: string | null;
        isAvailable: boolean;
        ownerId: string;
        ratingAverage: number | null;
        isVerified: boolean;
        verificationNotes: string | null;
    }>;
    findAll(params: {
        city?: string;
        minPrice?: number;
        maxPrice?: number;
        type?: StayType;
        page: number;
        limit: number;
    }): Promise<{
        data: ({
            _count: {
                reviews: number;
            };
            images: {
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                width: number | null;
                url: string;
                isPrimary: boolean;
                altText: string | null;
                height: number | null;
                size: number | null;
                mimeType: string | null;
                stayId: string;
            }[];
        } & {
            address: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string;
            reviewCount: number;
            city: string;
            state: string;
            country: string;
            type: import(".prisma/client").$Enums.StayType;
            title: string;
            viewCount: number;
            pricePerMonth: Prisma.Decimal;
            latitude: number | null;
            longitude: number | null;
            maxOccupants: number;
            availableFrom: Date;
            availableTo: Date | null;
            houseRules: string | null;
            cancellationPolicy: string | null;
            checkInTime: string | null;
            checkOutTime: string | null;
            isAvailable: boolean;
            ownerId: string;
            ratingAverage: number | null;
            isVerified: boolean;
            verificationNotes: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    search(query: string, page?: number, limit?: number): Promise<{
        data: ({
            _count: {
                reviews: number;
            };
            images: {
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                width: number | null;
                url: string;
                isPrimary: boolean;
                altText: string | null;
                height: number | null;
                size: number | null;
                mimeType: string | null;
                stayId: string;
            }[];
        } & {
            address: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string;
            reviewCount: number;
            city: string;
            state: string;
            country: string;
            type: import(".prisma/client").$Enums.StayType;
            title: string;
            viewCount: number;
            pricePerMonth: Prisma.Decimal;
            latitude: number | null;
            longitude: number | null;
            maxOccupants: number;
            availableFrom: Date;
            availableTo: Date | null;
            houseRules: string | null;
            cancellationPolicy: string | null;
            checkInTime: string | null;
            checkOutTime: string | null;
            isAvailable: boolean;
            ownerId: string;
            ratingAverage: number | null;
            isVerified: boolean;
            verificationNotes: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        reviews: ({
            user: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            rating: number;
            comment: string | null;
            title: string | null;
            images: string[];
            stayId: string;
            bookingId: string | null;
            isAnonymous: boolean;
            adminComment: string | null;
            adminId: string | null;
            moderatedAt: Date | null;
        })[];
        _count: {
            reviews: number;
        };
        amenities: {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            type: import(".prisma/client").$Enums.AmenityType;
            isAvailable: boolean;
            stayId: string;
            icon: string | null;
        }[];
        owner: {
            name: string;
            email: string;
            phone: string;
            id: string;
        };
        images: {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            width: number | null;
            url: string;
            isPrimary: boolean;
            altText: string | null;
            height: number | null;
            size: number | null;
            mimeType: string | null;
            stayId: string;
        }[];
    } & {
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        reviewCount: number;
        city: string;
        state: string;
        country: string;
        type: import(".prisma/client").$Enums.StayType;
        title: string;
        viewCount: number;
        pricePerMonth: Prisma.Decimal;
        latitude: number | null;
        longitude: number | null;
        maxOccupants: number;
        availableFrom: Date;
        availableTo: Date | null;
        houseRules: string | null;
        cancellationPolicy: string | null;
        checkInTime: string | null;
        checkOutTime: string | null;
        isAvailable: boolean;
        ownerId: string;
        ratingAverage: number | null;
        isVerified: boolean;
        verificationNotes: string | null;
    }>;
    findByOwner(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            _count: {
                reviews: number;
                bookings: number;
            };
            images: {
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                width: number | null;
                url: string;
                isPrimary: boolean;
                altText: string | null;
                height: number | null;
                size: number | null;
                mimeType: string | null;
                stayId: string;
            }[];
        } & {
            address: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string;
            reviewCount: number;
            city: string;
            state: string;
            country: string;
            type: import(".prisma/client").$Enums.StayType;
            title: string;
            viewCount: number;
            pricePerMonth: Prisma.Decimal;
            latitude: number | null;
            longitude: number | null;
            maxOccupants: number;
            availableFrom: Date;
            availableTo: Date | null;
            houseRules: string | null;
            cancellationPolicy: string | null;
            checkInTime: string | null;
            checkOutTime: string | null;
            isAvailable: boolean;
            ownerId: string;
            ratingAverage: number | null;
            isVerified: boolean;
            verificationNotes: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(userId: string, id: string, updateStayDto: UpdateStayDto): Promise<{
        amenities: {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            type: import(".prisma/client").$Enums.AmenityType;
            isAvailable: boolean;
            stayId: string;
            icon: string | null;
        }[];
        images: {
            order: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            width: number | null;
            url: string;
            isPrimary: boolean;
            altText: string | null;
            height: number | null;
            size: number | null;
            mimeType: string | null;
            stayId: string;
        }[];
    } & {
        address: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        reviewCount: number;
        city: string;
        state: string;
        country: string;
        type: import(".prisma/client").$Enums.StayType;
        title: string;
        viewCount: number;
        pricePerMonth: Prisma.Decimal;
        latitude: number | null;
        longitude: number | null;
        maxOccupants: number;
        availableFrom: Date;
        availableTo: Date | null;
        houseRules: string | null;
        cancellationPolicy: string | null;
        checkInTime: string | null;
        checkOutTime: string | null;
        isAvailable: boolean;
        ownerId: string;
        ratingAverage: number | null;
        isVerified: boolean;
        verificationNotes: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    addImages(userId: string, stayId: string, files: Express.Multer.File[]): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        width: number | null;
        url: string;
        isPrimary: boolean;
        altText: string | null;
        height: number | null;
        size: number | null;
        mimeType: string | null;
        stayId: string;
    }[]>;
    setPrimaryImage(userId: string, stayId: string, imageId: string): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        width: number | null;
        url: string;
        isPrimary: boolean;
        altText: string | null;
        height: number | null;
        size: number | null;
        mimeType: string | null;
        stayId: string;
    }>;
    removeImage(userId: string, stayId: string, imageId: string): Promise<{
        message: string;
    }>;
}
