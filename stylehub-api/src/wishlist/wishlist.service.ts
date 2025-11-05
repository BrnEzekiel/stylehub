// src/wishlist/wishlist.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get or create a wishlist for a user.
   */
  private async getOrCreateWishlist(userId: string) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });
    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
      });
    }
    return wishlist;
  }

  /**
   * Get all items in the user's wishlist.
   */
  async getWishlist(userId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, // Include the full product details for each item
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return wishlist || { items: [] };
  }

  /**
   * Add a product to the user's wishlist.
   */
  async addWishlistItem(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if item is already in wishlist
    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('Item is already in your wishlist');
    }

    // Add the new item
    return this.prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: productId,
      },
      include: {
        product: true, // Return the product info
      },
    });
  }

  /**
   * Remove a product from the user's wishlist.
   */
  async removeWishlistItem(userId: string, productId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    try {
      // Delete the item using the composite key
      await this.prisma.wishlistItem.delete({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId: productId,
          },
        },
      });
      return { message: 'Item removed from wishlist' };
    } catch (error) {
      // Prisma throws an error if the record to delete is not found
      throw new NotFoundException('Item not found in wishlist');
    }
  }

  /**
   * Get a list of product IDs that are in the user's wishlist.
   * This is a lightweight call for the UI to know which hearts to fill.
   */
  async getWishlistProductIds(userId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          select: {
            productId: true,
          },
        },
      },
    });

    if (!wishlist) {
      return [];
    }
    return wishlist.items.map(item => item.productId);
  }
}