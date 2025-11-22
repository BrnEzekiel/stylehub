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
exports.PayoutsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const wallet_service_1 = require("../wallet/wallet.service");
let PayoutsService = class PayoutsService {
    constructor(prisma, walletService) {
        this.prisma = prisma;
        this.walletService = walletService;
    }
    async getFinancialSummary() {
        try {
            const unpaidEarnings = await this.prisma.orderItem.aggregate({
                _sum: {
                    sellerEarning: true,
                },
                where: {
                    payoutId: null,
                    order: {
                        status: 'delivered',
                    },
                    product: {
                        sellerId: {
                            not: null,
                        },
                    },
                },
            });
            const totalPlatformFees = await this.prisma.orderItem.aggregate({
                _sum: {
                    platformFee: true,
                },
                where: {
                    order: {
                        status: 'delivered',
                    },
                },
            });
            const totalPaidOut = await this.prisma.payout.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    status: 'paid',
                },
            });
            return {
                totalOwedToSellers: unpaidEarnings._sum.sellerEarning || 0,
                totalPlatformRevenue: totalPlatformFees._sum.platformFee || 0,
                totalPaidOutToSellers: totalPaidOut._sum.amount || 0,
            };
        }
        catch (error) {
            console.error('Error in getFinancialSummary:', error);
            throw new common_1.InternalServerErrorException('Could not retrieve financial summary.');
        }
    }
    async getSellerPayoutSummaries() {
        try {
            const sellers = await this.prisma.user.findMany({
                where: { role: 'seller' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    payouts: {
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
            const sellerSummaries = await Promise.all(sellers.map(async (seller) => {
                const unpaid = await this.prisma.orderItem.aggregate({
                    _sum: {
                        sellerEarning: true,
                    },
                    where: {
                        product: {
                            sellerId: seller.id,
                        },
                        order: {
                            status: 'delivered',
                        },
                        payoutId: null,
                    },
                });
                return {
                    ...seller,
                    unpaidEarnings: unpaid._sum.sellerEarning || 0,
                };
            }));
            return sellerSummaries;
        }
        catch (error) {
            console.error('Error in getSellerPayoutSummaries:', error);
            throw new common_1.InternalServerErrorException('Could not retrieve seller payout summaries.');
        }
    }
    async createPayout(sellerId) {
        return this.prisma.$transaction(async (tx) => {
            const unpaidItems = await tx.orderItem.findMany({
                where: {
                    product: {
                        sellerId: sellerId,
                    },
                    order: {
                        status: 'delivered',
                    },
                    payoutId: null,
                },
                select: {
                    id: true,
                    sellerEarning: true,
                },
            });
            if (unpaidItems.length === 0) {
                throw new common_1.BadRequestException('This seller has no unpaid earnings from delivered orders.');
            }
            const totalAmount = unpaidItems.reduce((acc, item) => {
                return acc.add(item.sellerEarning);
            }, new client_1.Prisma.Decimal(0));
            if (totalAmount.lessThanOrEqualTo(0)) {
                throw new common_1.BadRequestException('Seller has no positive earnings to pay out.');
            }
            const newPayout = await tx.payout.create({
                data: {
                    sellerId: sellerId,
                    amount: totalAmount,
                    status: 'pending',
                },
            });
            await tx.orderItem.updateMany({
                where: {
                    id: {
                        in: unpaidItems.map((item) => item.id),
                    },
                },
                data: {
                    payoutId: newPayout.id,
                },
            });
            return newPayout;
        });
    }
    async markPayoutAsPaid(payoutId) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const payout = await tx.payout.findUnique({
                    where: { id: payoutId },
                });
                if (!payout) {
                    throw new common_1.NotFoundException('Payout not found.');
                }
                if (payout.status === 'paid') {
                    throw new common_1.BadRequestException('This payout has already been marked as paid.');
                }
                const updatedPayout = await tx.payout.update({
                    where: { id: payoutId },
                    data: {
                        status: 'paid',
                        processedAt: new Date(),
                    },
                });
                await this.walletService.addPayoutToWallet(tx, payout.sellerId, payout.amount, payout.id);
                return updatedPayout;
            });
        }
        catch (error) {
            console.error(`Error marking payout ${payoutId} as paid:`, error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Could not update payout status.');
        }
    }
};
exports.PayoutsService = PayoutsService;
exports.PayoutsService = PayoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService])
], PayoutsService);
//# sourceMappingURL=payouts.service.js.map