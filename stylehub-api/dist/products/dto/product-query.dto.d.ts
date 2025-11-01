export declare class ProductQueryDto {
    search?: string;
    category?: string;
    sortBy?: 'price' | 'createdAt' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: string;
    limit?: string;
}
