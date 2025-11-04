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

// 1. 🛑 Define your platform's commission rate (10%)
const PLATFORM_FEE_RATE = new Prisma.Decimal(0.10);

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
    if (!cart) {
      return { cart: { items: [] }, total: new Prisma.Decimal(0) };
    }
    const total = cart.items.reduce((acc, item) => {
      if (item.product && item.product.price) {
        return acc + item.product.price.toNumber() * item.quantity;
      }
      return acc;
    }, 0);
    return {
      cart,
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
   * 🛑 UPDATED: Checks out the cart, calculates commission, and creates an order.
   */
  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              // 2. 🛑 We MUST select sellerId to calculate commission
              select: { id: true, name: true, price: true, stock: true, sellerId: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout an empty cart.');
    }

    // 3. 🛑 Use Prisma.Decimal for all financial calculations
    let totalAmount = new Prisma.Decimal(0);
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
      
      const productPrice = item.product.price; // This is a Decimal
      const quantity = item.quantity;
      const subtotal = productPrice.times(quantity); // Use Decimal methods
      totalAmount = totalAmount.add(subtotal); // Use Decimal methods

      // 4. 🛑 NEW COMMISSION LOGIC
      let itemPlatformFee = new Prisma.Decimal(0);
      let itemSellerEarning = new Prisma.Decimal(0);

      // Check if the product has a seller.
      if (item.product.sellerId) {
        // Product is sold by a seller
        itemPlatformFee = subtotal.times(PLATFORM_FEE_RATE).toDecimalPlaces(2);
        itemSellerEarning = subtotal.minus(itemPlatformFee);
      } else {
        // Product is platform-owned (sellerId is null)
        itemPlatformFee = subtotal; // Platform gets 100%
        itemSellerEarning = new Prisma.Decimal(0); // Seller gets 0
      }

      orderItemsData.push({
        productId: item.productId,
        productName: item.product.name,
        unitPrice: productPrice,
        quantity: quantity,
        // 5. 🛑 Add the new financial data
        platformFee: itemPlatformFee,
        sellerEarning: itemSellerEarning,
      });
    }

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
            totalAmount: totalAmount, // This is now a Decimal
            status: 'pending',
            shippingAddressId: newAddress.id,
            items: {
              createMany: {
                data: orderItemsData, // This now includes commission
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
          totalAmount: newOrder.totalAmount,
        };
      },
      {
        timeout: 30000,
      },
    );
  }
}