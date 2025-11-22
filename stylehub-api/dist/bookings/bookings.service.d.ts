import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServiceBookingStatus, Prisma } from '@prisma/client';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    createBooking(clientId: string, dto: CreateBookingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: Prisma.Decimal;
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
    getClientBookings(clientId: string): Promise<({
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
        price: Prisma.Decimal;
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
    getProviderBookings(providerId: string): Promise<({
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
        price: Prisma.Decimal;
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
    updateBookingStatus(bookingId: string, newStatus: ServiceBookingStatus, userId: string, userRole: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: Prisma.Decimal;
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
    cancelBooking(bookingId: string, clientId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ServiceBookingStatus;
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
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
    downloadConfirmation(bookingId: string, clientId: string): Promise<Buffer>;
    private generateConfirmationPDF;
}
