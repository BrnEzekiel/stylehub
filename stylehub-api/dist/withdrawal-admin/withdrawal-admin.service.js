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
exports.WithdrawalAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WithdrawalAdminService = class WithdrawalAdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllWithdrawalRequests() {
        try {
            return await this.prisma.withdrawalRequest.findMany({
                include: {
                    seller: {
                        select: { name: true, email: true, phone: true },
                    },
                },
                orderBy: [
                    { status: 'asc' },
                    { createdAt: 'desc' },
                ],
            });
        }
        catch (error) {
            console.error('Error fetching withdrawal requests:', error);
            throw new common_1.InternalServerErrorException('Could not fetch withdrawal requests.');
        }
    }
    async updateWithdrawalStatus(requestId, newStatus, adminRemarks) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.withdrawalRequest.findUnique({
                where: { id: requestId },
            });
            if (!request) {
                throw new common_1.NotFoundException('Withdrawal request not found.');
            }
            if (request.status !== client_1.WithdrawalStatus.pending) {
                throw new common_1.BadRequestException(`Request is already ${request.status}.`);
            }
            if (newStatus === client_1.WithdrawalStatus.rejected) {
                await tx.user.update({
                    where: { id: request.sellerId },
                    data: {
                        walletBalance: {
                            increment: request.amount,
                        },
                    },
                });
                await tx.walletTransaction.create({
                    data: {
                        userId: request.sellerId,
                        type: 'credit',
                        amount: request.amount,
                        description: `Refund for rejected withdrawal: ${adminRemarks || 'Rejected by admin'}`,
                        withdrawalRequest: { connect: { id: request.id } },
                    },
                });
            }
            return tx.withdrawalRequest.update({
                where: { id: requestId },
                data: {
                    status: newStatus,
                    adminRemarks: adminRemarks,
                    processedAt: new Date(),
                },
            });
        });
    }
};
exports.WithdrawalAdminService = WithdrawalAdminService;
exports.WithdrawalAdminService = WithdrawalAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WithdrawalAdminService);
//# sourceMappingURL=withdrawal-admin.service.js.map