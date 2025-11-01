// src/products/products.service.ts

import { 
  Injectable, 
  ForbiddenException, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { SearchService } from '../search/search.service';
import { StorageService } from '../storage/storage.service'; 
import { Prisma } from '@prisma/client'; // 1. 🛑 Import Prisma for transaction

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private searchService: SearchService,
  ) {}

  // --- Your Existing create Method ---
  async create(
    data: CreateProductDto, 
    sellerId: string, 
    file: any
  ) {
    if (!file) {
      throw new BadRequestException('Product image file is required.');
    }

    const kycStatus = await this.prisma.kYC.findUnique({
      where: { user_id: sellerId },
      select: { status: true },
    });

    if (!kycStatus || kycStatus.status !== 'approved') {
      throw new ForbiddenException('Seller KYC status must be approved to create a product.');
    }

    let imageUrl: string;
    try {
      const uploadResult = await this.storageService.upload(
        file.buffer,
        'products'
      );
      if (!uploadResult?.secure_url) {
        throw new Error('Image upload failed to return a secure URL.');
      }
      imageUrl = uploadResult.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new InternalServerErrorException('Failed to upload product image.');
    }

    const newProduct = await this.prisma.product.create({
      data: {
        ...data,
        price: data.price,
        stock: data.stock,
        sellerId: sellerId,
        imageUrl: imageUrl,
      },
    });

    await this.searchService.indexProduct(newProduct);
    
    return newProduct;
  }
  
  // --- Your Existing findAll Method ---
  async findAll(query: ProductQueryDto) {
    const { 
      search, 
      category, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = '1',
      limit = '10'
    } = query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    if (search) {
        const searchResult = await this.searchService.searchProducts(search);
        
        return {
          products: searchResult.results,
          meta: {
            total: searchResult.totalHits,
            page: 1, 
            limit: searchResult.results.length,
            totalPages: 1, 
          }
        };
    }
    
    const where: any = {};
    if (category) {
      where.category = category;
    }

    const orderBy: any = { 
      [sortBy]: sortOrder 
    };

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
    });
    
    const total = await this.prisma.product.count({ where });

    return {
      products,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    };
  }

  // --- Your Existing findOne Method ---
  async findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  // --- Your Existing update Method ---
  async update(id: string, updateProductDto: UpdateProductDto, sellerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to modify this product.');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    
    await this.searchService.indexProduct(updatedProduct);

    return updatedProduct;
  }

  // --- Your Existing remove Method ---
  async remove(id: string, sellerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to delete this product.');
    }

    // 🛑 Note: This simple delete WILL FAIL if the product is in a Cart or Order.
    // The removeAdmin method below is safer.
    await this.prisma.product.delete({ where: { id } });
    
    await this.searchService.deleteProduct(id);
    
    return { message: 'Product successfully deleted.' };
  }

  // --- 🛑 NEW ADMIN METHODS 🛑 ---

  /**
   * Get all products from all sellers.
   */
  async findAllAdmin() {
    return this.prisma.product.findMany({
      include: {
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Admin-level delete for any product (bypasses ownership).
   * This version is safer and cleans up dependencies.
   */
  async removeAdmin(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        // Set product link in OrderItems to null
        await tx.orderItem.updateMany({
          where: { productId: id },
          data: { productId: null },
        });

        // Delete all CartItems with this product
        await tx.cartItem.deleteMany({
          where: { productId: id },
        });
        
        // Delete all Reviews for this product
        await tx.review.deleteMany({
          where: { productId: id },
        });

        // Finally, delete the product
        await tx.product.delete({
          where: { id },
        });
      });

      // Remove from search index
      await this.searchService.deleteProduct(id);

      return { message: 'Product successfully deleted by admin.' };
    } catch (error) {
      console.error('Admin product delete error:', error);
      throw new InternalServerErrorException('Could not delete product.');
    }
  }
}