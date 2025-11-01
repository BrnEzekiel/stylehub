import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException, // 1. Import UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Finds a user's cart or creates one if it doesn't exist.
   */
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

  /**
   * Adds an item to the user's cart.
   */
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

  /**
   * Gets the full details of a user's cart.
   */
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
      // Don't throw an error, just return an empty structure
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

  /**
   * 🛑 FIX: Removes an item using cartItemId (the item's unique ID)
   */
  async removeItem(userId: string, cartItemId: string) {
    // 1. Find the cart item to ensure it exists
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }, // Include the parent cart
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // 2. Security Check: Ensure the item belongs to this user's cart
    if (cartItem.cart.userId !== userId) {
      throw new UnauthorizedException('This item does not belong to your cart');
    }

    // 3. Delete the item
    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { message: 'Item removed successfully' };
  }

  /**
   * Checks out the cart and creates an order.
   */
  async checkout(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, stock: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout an empty cart.');
    }

    let totalAmount = 0;
    const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of cart.items) {
      if (!item.product) {
         throw new NotFoundException(`Product data missing for item in cart. Product may have been deleted.`);
      }
      
      const productPrice = item.product.price;
      const quantity = item.quantity;
      const subtotal = productPrice.toNumber() * quantity;

      if (item.product.stock < quantity) {
        throw new BadRequestException(
          `Product "${item.product.name}" is out of stock or requested quantity exceeds available stock (${item.product.stock}).`,
        );
      }

      totalAmount += subtotal;

      orderItemsData.push({
        productId: item.productId,
        productName: item.product.name,
        unitPrice: productPrice,
        quantity: quantity,
      });
    }

    return this.prisma.$transaction(
      async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId: userId,
            totalAmount: new Prisma.Decimal(totalAmount),
            status: 'pending',
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
          message: 'Order placed successfully. Awaiting payment.',
          orderId: newOrder.id,
          totalAmount: newOrder.totalAmount,
        };
      },
      {
        timeout: 30000, // 30 seconds
      },
    );
  }
}
