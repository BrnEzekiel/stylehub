"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const search_service_1 = require("../search/search.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService {
    constructor(prisma, storageService, searchService) {
        this.prisma = prisma;
        this.storageService = storageService;
        this.searchService = searchService;
    }
    async create(data, sellerId, file) {
        if (!file) {
            throw new common_1.BadRequestException('Product image file is required.');
        }
        const kycStatus = await this.prisma.kYC.findUnique({
            where: { user_id: sellerId },
            select: { status: true },
        });
        if (!kycStatus || kycStatus.status !== 'approved') {
            throw new common_1.ForbiddenException('Seller KYC status must be approved to create a product.');
        }
        let imageUrl;
        try {
            const uploadResult = await this.storageService.upload(file.buffer, 'products');
            if (!uploadResult?.secure_url) {
                throw new Error('Image upload failed to return a secure URL.');
            }
            imageUrl = uploadResult.secure_url;
        }
        catch (error) {
            console.error('Image upload failed:', error);
            throw new common_1.InternalServerErrorException('Failed to upload product image.');
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
    async findAll(query) {
        const { search, category, sortBy = 'createdAt', sortOrder = 'desc', page = '1', limit = '10' } = query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const includeSeller = {
            seller: {
                select: {
                    id: true,
                    name: true,
                    verificationStatus: true,
                },
            },
        };
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
        const where = {};
        if (category) {
            where.category = category;
        }
        const orderBy = { [sortBy]: sortOrder };
        const products = await this.prisma.product.findMany({
            where,
            orderBy,
            skip,
            take,
            include: includeSeller,
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
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        verificationStatus: true
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto, sellerId) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found.`);
        }
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('You do not have permission to modify this product.');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
        await this.searchService.indexProduct(updatedProduct);
        return updatedProduct;
    }
    async remove(id, sellerId) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found.`);
        }
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this product.');
        }
        await this.prisma.product.delete({ where: { id } });
        await this.searchService.deleteProduct(id);
        return { message: 'Product successfully deleted.' };
    }
    async adminCreateProduct(data, file, sellerId = null) {
        if (!file) {
            throw new common_1.BadRequestException('Product image file is required.');
        }
        let imageUrl;
        try {
            const uploadResult = await this.storageService.upload(file.buffer, 'products');
            if (!uploadResult?.secure_url) {
                throw new Error('Image upload failed to return a secure URL.');
            }
            imageUrl = uploadResult.secure_url;
        }
        catch (error) {
            console.error('Image upload failed:', error);
            throw new common_1.InternalServerErrorException('Failed to upload product image.');
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
    async findAllAdmin() {
        return this.prisma.product.findMany({
            include: {
                seller: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async removeAdmin(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.orderItem.updateMany({ where: { productId: id }, data: { productId: null } });
                await tx.cartItem.deleteMany({ where: { productId: id } });
                await tx.review.deleteMany({ where: { productId: id } });
                await tx.product.delete({ where: { id } });
            });
            await this.searchService.deleteProduct(id);
            return { message: 'Product successfully deleted by admin.' };
        }
        catch (error) {
            console.error('Admin product delete error:', error);
            throw new common_1.InternalServerErrorException('Could not delete product.');
        }
    }
    async adminUpdateProduct(id, data) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found.`);
        }
        const updateData = { ...data };
        if (data.price) {
            updateData.price = new client_1.Prisma.Decimal(data.price);
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateData,
        });
        await this.searchService.indexProduct(updatedProduct);
        return updatedProduct;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        search_service_1.SearchService])
], ProductsService);
//# sourceMappingURL=products.service.js.map