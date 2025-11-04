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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StatsService = class StatsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminDashboardStats() {
        try {
            const revenueData = await this.prisma.order.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    status: {
                        in: ['paid', 'shipped', 'delivered'],
                    },
                },
            });
            const totalUsers = await this.prisma.user.count();
            const totalProducts = await this.prisma.product.count();
            const pendingKYC = await this.prisma.kYC.count({
                where: {
                    status: client_1.KycStatus.pending,
                },
            });
            return {
                totalRevenue: revenueData._sum.totalAmount || 0,
                totalUsers,
                totalProducts,
                pendingKYC,
            };
        }
        catch (error) {
            console.error('Error fetching admin stats:', error);
            throw new common_1.InternalServerErrorException('Could not load dashboard statistics.');
        }
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map