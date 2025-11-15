import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(req: any, dto: CreateBookingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        walletTransactionId: string | null;
        startTime: Date;
        endTime: Date;
        isHomeService: boolean;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        status: import(".prisma/client").$Enums.BookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        walletTransactionId: string | null;
        startTime: Date;
        endTime: Date;
        isHomeService: boolean;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        status: import(".prisma/client").$Enums.BookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        walletTransactionId: string | null;
        startTime: Date;
        endTime: Date;
        isHomeService: boolean;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        serviceId: string;
        clientId: string;
        providerId: string;
    })[]>;
    updateBookingStatus(req: any, id: string, status: BookingStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        walletTransactionId: string | null;
        startTime: Date;
        endTime: Date;
        isHomeService: boolean;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        serviceId: string;
        clientId: string;
        providerId: string;
    }>;
    cancelBooking(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        walletTransactionId: string | null;
        startTime: Date;
        endTime: Date;
        isHomeService: boolean;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
        status: import(".prisma/client").$Enums.BookingStatus;
        price: import("@prisma/client/runtime/library").Decimal;
        walletTransactionId: string | null;
        startTime: Date;
        endTime: Date;
        isHomeService: boolean;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        serviceId: string;
        clientId: string;
        providerId: string;
    })[]>;
}
