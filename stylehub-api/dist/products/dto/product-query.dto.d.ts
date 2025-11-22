export declare class ProductQueryDto {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    inStockOnly?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'createdAt' | 'name' | 'rating';
    sortOrder?: 'asc' | 'desc';
    page?: string;
    limit?: string;
}
