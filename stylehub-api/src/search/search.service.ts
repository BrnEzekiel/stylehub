// src/search/search.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type SearchProductDocument = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  averageRating: number;
};

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private prisma: PrismaService) {}

  // ... (indexProduct, deleteProduct, reindexAllProducts methods are unchanged) ...
  async indexProduct(product: Product): Promise<void> {
    const document: SearchProductDocument = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toNumber(), // Convert Prisma Decimal to number
      averageRating: product.averageRating.toNumber(),
    };
    
    this.logger.log(`[Search Index] Indexed/Updated product ID: ${product.id} - ${product.name}`);
  }
  
  async deleteProduct(productId: string): Promise<void> {
    this.logger.log(`[Search Index] Deleted product ID: ${productId}`);
  }

  async reindexAllProducts(): Promise<void> {
    this.logger.log('Starting full product re-indexing. This is a maintenance task.');
  }
  
  // --------------------------------------------------
  // 🛑 SEARCH FUNCTION (UPDATED)
  // --------------------------------------------------
  async searchProducts(query: string) {
    if (!query) {
        return { results: [], totalHits: 0 };
    }

    this.logger.log(`[Search Index] Executing search for: "${query}"`);
    
    const products = await this.prisma.product.findMany({
      where: {
        // Search in name, description, AND category
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // 1. 🛑 FIX: Added category search
          {
            category: {
              contains: query,
              mode: 'insensitive',
            }
          }
        ],
      },
    });

    return {
      results: products,
      totalHits: products.length,
    };
  }
}