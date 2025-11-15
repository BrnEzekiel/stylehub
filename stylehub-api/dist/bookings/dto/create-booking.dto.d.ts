import { PaymentMethod } from '@prisma/client';
export declare class CreateBookingDto {
    serviceId: string;
    startTime: string;
    isHomeService: boolean;
    paymentMethod: PaymentMethod;
}
