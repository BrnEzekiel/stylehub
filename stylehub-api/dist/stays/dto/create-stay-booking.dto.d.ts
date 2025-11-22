import { PaymentMethod } from '@prisma/client';
export declare class CreateStayBookingDto {
    stayId: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    specialRequests?: string;
    paymentMethod?: PaymentMethod;
    currency?: string;
}
