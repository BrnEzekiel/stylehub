import { Order } from '@prisma/client';
type DetailedOrder = Order & {
    user: {
        name: string;
        email: string;
    };
    shippingAddress: {
        fullName: string;
        phone: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    items: Array<{
        productName: string;
        quantity: number;
        unitPrice: any;
    }>;
};
export declare class PdfGeneratorService {
    generateReceipt(order: DetailedOrder): Promise<Buffer>;
}
export {};
