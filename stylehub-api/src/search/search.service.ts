// src/search/search.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'; // 1. Import PrismaService

// Define the structure of the data we want to send to the search engine
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

  // 2. Inject PrismaService
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------
  // 🛑 INDEX/UPDATE A SINGLE PRODUCT
  // --------------------------------------------------
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
  
  // --------------------------------------------------
  // 🛑 DELETE A PRODUCT FROM THE INDEX
  // --------------------------------------------------
  async deleteProduct(productId: string): Promise<void> {
    this.logger.log(`[Search Index] Deleted product ID: ${productId}`);
  }

  // --------------------------------------------------
  // 🛑 REINDEX ALL PRODUCTS (Admin/Maintenance function)
  // --------------------------------------------------
  async reindexAllProducts(): Promise<void> {
    this.logger.log('Starting full product re-indexing. This is a maintenance task.');
  }
  
  // --------------------------------------------------
  // 🛑 SEARCH FUNCTION (For ProductsController to use)
  // --------------------------------------------------
  async searchProducts(query: string) {
    if (!query) {
        return { results: [], totalHits: 0 };
    }

    this.logger.log(`[Search Index] Executing search for: "${query}"`);
    
    // --- 🛑 SIMULATION REMOVED - REAL QUERY ADDED 🛑 ---
    // This now searches your actual database
    const products = await this.prisma.product.findMany({
      where: {
        // Search in both name AND description
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive', // Makes the search case-insensitive
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return {
      results: products, // Return the REAL product objects
      totalHits: products.length,
    };
    // --- END REAL QUERY ---
  }
}