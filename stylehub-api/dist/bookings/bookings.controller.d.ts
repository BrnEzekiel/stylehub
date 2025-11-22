import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServiceBookingStatus } from '@prisma/client';
import { StreamableFile } from '@nestjs/common';
import { FastifyReply } from 'fastify';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(req: any, dto: CreateBookingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        walletTransactionId: string | null;
        notes: string | null;
        isHomeService: boolean;
        scheduledAt: Date | null;
        completedAt: Date | null;
        cancellationReason: string | null;
        serviceId: string;
        clientId: string;
        providerId: string;
    }>;
    getClientBookings(req: any): Promise<({
        service: {
            imageUrl: string;
            title: string;
        };
        provider: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        walletTransactionId: string | null;
        notes: string | null;
        isHomeService: boolean;
        scheduledAt: Date | null;
        completedAt: Date | null;
        cancellationReason: string | null;
        serviceId: string;
        clientId: string;
        providerId: string;
    })[]>;
    getProviderBookings(req: any): Promise<({
        service: {
            title: string;
        };
        client: {
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        walletTransactionId: string | null;
        notes: string | null;
        isHomeService: boolean;
        scheduledAt: Date | null;
        completedAt: Date | null;
        cancellationReason: string | null;
        serviceId: string;
        clientId: string;
        providerId: string;
    })[]>;
    updateServiceBookingStatus(req: any, id: string, status: ServiceBookingStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        walletTransactionId: string | null;
        notes: string | null;
        isHomeService: boolean;
        scheduledAt: Date | null;
        completedAt: Date | null;
        cancellationReason: string | null;
        serviceId: string;
        clientId: string;
        providerId: string;
    }>;
    cancelBooking(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        walletTransactionId: string | null;
        notes: string | null;
        isHomeService: boolean;
        scheduledAt: Date | null;
        completedAt: Date | null;
        cancellationReason: string | null;
        serviceId: string;
        clientId: string;
        providerId: string;
    }>;
    getAllBookingsAdmin(): Promise<({
        service: {
            title: string;
        };
        client: {
            name: string;
            email: string;
        };
        provider: {
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        walletTransactionId: string | null;
        notes: string | null;
        isHomeService: boolean;
        scheduledAt: Date | null;
        completedAt: Date | null;
        cancellationReason: string | null;
        serviceId: string;
        clientId: string;
        providerId: string;
    })[]>;
    downloadConfirmation(req: any, id: string, res: FastifyReply): Promise<StreamableFile>;
}
