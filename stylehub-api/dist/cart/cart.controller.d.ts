import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    checkout(req: any, checkoutDto: CheckoutDto): Promise<{
        message: string;
        orderId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    addItem(req: any, addItemDto: AddItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        productId: string;
        cartId: string;
    }>;
    getCart(req: any): Promise<{
        cart: {
            items: any[];
        };
        total: import("@prisma/client/runtime/library").Decimal;
    } | {
        cart: {
            items: ({
                product: {
                    name: string;
                    id: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    imageUrl: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                productId: string;
                cartId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeItem(req: any, cartItemId: string): Promise<{
        message: string;
    }>;
}
