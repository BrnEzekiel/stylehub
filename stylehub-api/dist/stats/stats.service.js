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
const date_fns_1 = require("date-fns");
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
    async getSellerDashboardStats(userId) {
        try {
            const today = new Date();
            const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const prevMonthStart = (0, date_fns_1.addMonths)(currentMonthStart, -1);
            const prevMonthEnd = (0, date_fns_1.addMonths)(currentMonthEnd, -1);
            const currentProductCount = await this.prisma.product.count({
                where: { sellerId: userId },
            });
            const currentOrderItems = await this.prisma.orderItem.findMany({
                where: {
                    product: {
                        sellerId: userId,
                    },
                    order: {
                        status: {
                            in: ['paid', 'shipped', 'delivered'],
                        },
                        createdAt: {
                            gte: currentMonthStart,
                            lte: currentMonthEnd,
                        },
                    },
                },
                select: {
                    orderId: true,
                    sellerEarning: true,
                },
            });
            const currentTotalOrders = new Set(currentOrderItems.map(item => item.orderId)).size;
            const currentTotalRevenue = currentOrderItems.reduce((sum, item) => sum + parseFloat(item.sellerEarning.toString()), 0);
            const prevProductCount = await this.prisma.product.count({
                where: {
                    sellerId: userId,
                    createdAt: {
                        gte: prevMonthStart,
                        lte: prevMonthEnd,
                    },
                },
            });
            const prevOrderItems = await this.prisma.orderItem.findMany({
                where: {
                    product: {
                        sellerId: userId,
                    },
                    order: {
                        status: {
                            in: ['paid', 'shipped', 'delivered'],
                        },
                        createdAt: {
                            gte: prevMonthStart,
                            lte: prevMonthEnd,
                        },
                    },
                },
                select: {
                    orderId: true,
                    sellerEarning: true,
                },
            });
            const prevTotalOrders = new Set(prevOrderItems.map(item => item.orderId)).size;
            const prevTotalRevenue = prevOrderItems.reduce((sum, item) => sum + parseFloat(item.sellerEarning.toString()), 0);
            const calculateGrowth = (current, previous) => {
                if (previous === 0)
                    return current > 0 ? 100 : 0;
                return parseFloat((((current - previous) / previous) * 100).toFixed(1));
            };
            const revenueGrowth = calculateGrowth(currentTotalRevenue, prevTotalRevenue);
            const productGrowth = calculateGrowth(currentProductCount, prevProductCount);
            const ordersGrowth = calculateGrowth(currentTotalOrders, prevTotalOrders);
            const stats = [
                { id: '1', title: 'Total Revenue', value: `KSH ${currentTotalRevenue.toFixed(2)}`, growth: revenueGrowth, icon: '💰' },
                { id: '2', title: 'Total Products', value: currentProductCount, growth: productGrowth, icon: '📦' },
                { id: '3', title: 'Total Orders', value: currentTotalOrders, growth: ordersGrowth, icon: '🛒' },
            ];
            const recentOrderItems = await this.prisma.orderItem.findMany({
                where: {
                    product: {
                        sellerId: userId,
                    },
                    order: {
                        status: {
                            in: ['paid', 'shipped', 'delivered'],
                        },
                    },
                },
                distinct: ['orderId'],
                orderBy: {
                    order: {
                        createdAt: 'desc',
                    },
                },
                take: 5,
                select: {
                    order: {
                        select: {
                            id: true,
                            totalAmount: true,
                            status: true,
                            user: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
            const formattedRecentOrders = recentOrderItems.map(item => ({
                id: item.order.id,
                customer: item.order.user?.username || 'N/A',
                amount: `KSH ${item.order.totalAmount.toFixed(2)}`,
                status: item.order.status,
            }));
            const products = await this.prisma.product.findMany({
                where: {
                    sellerId: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    stock: true,
                },
            });
            const formattedProducts = products.map(product => ({
                id: product.id,
                name: product.name,
                price: `KSH ${product.price.toFixed(2)}`,
                stock: product.stock,
            }));
            return {
                stats,
                recentOrders: formattedRecentOrders,
                products: formattedProducts,
            };
        }
        catch (error) {
            console.error(`Error fetching seller stats for user ${userId}:`, error);
            throw new common_1.InternalServerErrorException('Could not load seller statistics.');
        }
    }
    async getSellerRevenueData(userId, period) {
        try {
            const today = new Date();
            let startDate;
            let dateFormat;
            let aggregationUnit;
            switch (period) {
                case '1day':
                    startDate = (0, date_fns_1.subDays)(today, 1);
                    dateFormat = 'HH:00';
                    aggregationUnit = 'day';
                    break;
                case '1week':
                    startDate = (0, date_fns_1.subWeeks)(today, 1);
                    dateFormat = 'EEE, MMM d';
                    aggregationUnit = 'day';
                    break;
                case '1month':
                    startDate = (0, date_fns_1.subMonths)(today, 1);
                    dateFormat = 'MMM d';
                    aggregationUnit = 'day';
                    break;
                case '6months':
                    startDate = (0, date_fns_1.subMonths)(today, 6);
                    dateFormat = 'MMM yyyy';
                    aggregationUnit = 'month';
                    break;
                case '1year':
                    startDate = (0, date_fns_1.subYears)(today, 1);
                    dateFormat = 'MMM yyyy';
                    aggregationUnit = 'month';
                    break;
                default:
                    startDate = (0, date_fns_1.subMonths)(today, 6);
                    dateFormat = 'MMM yyyy';
                    aggregationUnit = 'month';
                    break;
            }
            const relevantOrderItems = await this.prisma.orderItem.findMany({
                where: {
                    product: {
                        sellerId: userId,
                    },
                    order: {
                        status: {
                            in: ['paid', 'shipped', 'delivered'],
                        },
                        createdAt: {
                            gte: startDate,
                            lte: today,
                        },
                    },
                },
                select: {
                    sellerEarning: true,
                    order: {
                        select: {
                            createdAt: true,
                        },
                    },
                },
                orderBy: {
                    order: {
                        createdAt: 'asc',
                    },
                },
            });
            const aggregatedDataMap = new Map();
            let currentIterateDate = new Date(startDate);
            while (currentIterateDate <= today) {
                let label;
                if (aggregationUnit === 'day') {
                    label = (0, date_fns_1.format)(currentIterateDate, dateFormat);
                }
                else {
                    label = (0, date_fns_1.format)(currentIterateDate, dateFormat);
                }
                aggregatedDataMap.set(label, 0);
                if (aggregationUnit === 'day') {
                    currentIterateDate.setDate(currentIterateDate.getDate() + 1);
                }
                else {
                    currentIterateDate.setMonth(currentIterateDate.getMonth() + 1);
                }
                if (currentIterateDate.getMonth() === today.getMonth() && currentIterateDate.getFullYear() === today.getFullYear() && aggregationUnit === 'month') {
                    if (currentIterateDate <= (0, date_fns_1.subDays)(today, 1)) {
                        currentIterateDate = today;
                    }
                    else {
                        break;
                    }
                }
                if (currentIterateDate > today && aggregationUnit === 'day')
                    break;
            }
            relevantOrderItems.forEach(item => {
                const itemDate = item.order.createdAt;
                let label;
                if (aggregationUnit === 'day') {
                    label = (0, date_fns_1.format)(itemDate, dateFormat);
                }
                else {
                    label = (0, date_fns_1.format)(itemDate, dateFormat);
                }
                const currentTotal = aggregatedDataMap.get(label) || 0;
                aggregatedDataMap.set(label, currentTotal + parseFloat(item.sellerEarning.toString()));
            });
            const labels = Array.from(aggregatedDataMap.keys());
            const data = Array.from(aggregatedDataMap.values());
            return {
                labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: data,
                        backgroundColor: 'rgba(0, 191, 255, 0.6)',
                        borderColor: 'rgba(0, 191, 255, 1)',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.4,
                    },
                ],
            };
        }
        catch (error) {
            console.error(`Error fetching seller revenue data for user ${userId} and period ${period}:`, error);
            throw new common_1.InternalServerErrorException('Could not load seller revenue data.');
        }
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
//# sourceMappingURL=stats.service.js.map