// src/cart/cart.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { Prisma } from '@prisma/client';
import { CheckoutDto } from './dto/checkout.dto';

const PLATFORM_FEE_RATE = new Prisma.Decimal(0.10);
const SHIPPING_FEE = new Prisma.Decimal(200.00); // 1. 🛑 NEW: Standard KES 200 shipping fee

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }
    return cart;
  }
  
  async addItemToCart(userId: string, dto: AddItemDto) {
    const { productId, quantity } = dto;
    const cart = await this.getOrCreateCart(userId);
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock for updated quantity');
      }
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
    
    // 2. 🛑 Calculate subtotal
    const subtotal = cart?.items.reduce((acc, item) => {
      if (item.product && item.product.price) {
        return acc + item.product.price.toNumber() * item.quantity;
      }
      return acc;
    }, 0) || 0;

    const total = subtotal > 0 ? subtotal + SHIPPING_FEE.toNumber() : 0;
    
    return {
      cart: cart || { items: [] },
      subtotal: new Prisma.Decimal(subtotal),
      shippingFee: SHIPPING_FEE,
      total: new Prisma.Decimal(total),
    };
  }
  
  async removeItem(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    if (cartItem.cart.userId !== userId) {
      throw new UnauthorizedException('This item does not belong to your cart');
    }
    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return { message: 'Item removed successfully' };
  }

  /**
   * 🛑 UPDATED: Adds shipping fee to the order.
   */
  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, stock: true, sellerId: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout an empty cart.');
    }

    let subtotal = new Prisma.Decimal(0); // 3. 🛑 Changed to subtotal
    const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of cart.items) {
      if (!item.product) {
         throw new NotFoundException(`Product data missing for item in cart. Product may have been deleted.`);
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Product "${item.product.name}" is out of stock.`,
        );
      }
      
      const productPrice = item.product.price;
      const quantity = item.quantity;
      const itemSubtotal = productPrice.times(quantity);
      subtotal = subtotal.add(itemSubtotal); // 4. 🛑 Add to subtotal

      let itemPlatformFee = new Prisma.Decimal(0);
      let itemSellerEarning = new Prisma.Decimal(0);

      if (item.product.sellerId) {
        itemPlatformFee = itemSubtotal.times(PLATFORM_FEE_RATE).toDecimalPlaces(2);
        itemSellerEarning = itemSubtotal.minus(itemPlatformFee);
      } else {
        itemPlatformFee = itemSubtotal;
        itemSellerEarning = new Prisma.Decimal(0);
      }

      orderItemsData.push({
        productId: item.productId,
        productName: item.product.name,
        unitPrice: productPrice,
        quantity: quantity,
        platformFee: itemPlatformFee,
        sellerEarning: itemSellerEarning,
      });
    }

    // 5. 🛑 Calculate Grand Total
    const totalAmount = subtotal.add(SHIPPING_FEE);

    return this.prisma.$transaction(
      async (tx) => {
        const newAddress = await tx.address.create({
          data: {
            userId: userId,
            ...dto,
          },
        });

        const newOrder = await tx.order.create({
          data: {
            userId: userId,
            subtotal: subtotal, // 6. 🛑 Save subtotal
            shippingFee: SHIPPING_FEE, // 7. 🛑 Save shippingFee
            totalAmount: totalAmount, // 8. 🛑 Save grand total
            status: 'pending',
            shippingAddressId: newAddress.id,
            items: {
              createMany: {
                data: orderItemsData,
              },
            },
          },
        });

        const stockUpdates = cart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        );
        await Promise.all(stockUpdates);

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return {
          message: 'Order created. Proceed to payment.',
          orderId: newOrder.id,
          totalAmount: newOrder.totalAmount, // Return the grand total
        };
      },
      {
        timeout: 30000,
      },
    );
  }
}