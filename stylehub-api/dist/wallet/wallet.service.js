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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WalletService = class WalletService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addPayoutToWallet(tx, sellerId, amount, payoutId) {
        try {
            const updatedUser = await tx.user.update({
                where: { id: sellerId },
                data: {
                    walletBalance: {
                        increment: amount,
                    },
                },
            });
            const transaction = await tx.walletTransaction.create({
                data: {
                    userId: sellerId,
                    type: client_1.TransactionType.credit,
                    amount: amount,
                    description: `Payout from Payout ID: ${payoutId.substring(0, 8)}`,
                },
            });
            await tx.payout.update({
                where: { id: payoutId },
                data: {
                    walletTransactionId: transaction.id,
                },
            });
            return updatedUser;
        }
        catch (error) {
            console.error('Failed to add payout to wallet:', error);
            throw new common_1.InternalServerErrorException('Could not update wallet balance.');
        }
    }
    async getWalletDetails(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                walletBalance: true,
                walletTransactions: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 20,
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async requestWithdrawal(userId, dto) {
        const amountToWithdraw = new client_1.Prisma.Decimal(dto.amount);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (user.walletBalance.lessThan(amountToWithdraw)) {
                throw new common_1.BadRequestException('Insufficient wallet balance.');
            }
            await tx.user.update({
                where: { id: userId },
                data: {
                    walletBalance: {
                        decrement: amountToWithdraw,
                    },
                },
            });
            const transaction = await tx.walletTransaction.create({
                data: {
                    userId: userId,
                    type: client_1.TransactionType.debit,
                    amount: amountToWithdraw.negated(),
                    description: `Withdrawal request to ${dto.mpesaNumber}`,
                },
            });
            const withdrawalRequest = await tx.withdrawalRequest.create({
                data: {
                    sellerId: userId,
                    amount: amountToWithdraw,
                    status: client_1.WithdrawalStatus.pending,
                    mpesaNumber: dto.mpesaNumber,
                    walletTransactionId: transaction.id,
                },
            });
            return withdrawalRequest;
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map