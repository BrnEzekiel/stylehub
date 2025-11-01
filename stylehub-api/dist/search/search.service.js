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
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = SearchService_1 = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SearchService_1.name);
    }
    async indexProduct(product) {
        const document = {
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price.toNumber(),
            averageRating: product.averageRating.toNumber(),
        };
        this.logger.log(`[Search Index] Indexed/Updated product ID: ${product.id} - ${product.name}`);
    }
    async deleteProduct(productId) {
        this.logger.log(`[Search Index] Deleted product ID: ${productId}`);
    }
    async reindexAllProducts() {
        this.logger.log('Starting full product re-indexing. This is a maintenance task.');
    }
    async searchProducts(query) {
        if (!query) {
            return { results: [], totalHits: 0 };
        }
        this.logger.log(`[Search Index] Executing search for: "${query}"`);
        const products = await this.prisma.product.findMany({
            where: {
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
                ],
            },
        });
        return {
            results: products,
            totalHits: products.length,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map