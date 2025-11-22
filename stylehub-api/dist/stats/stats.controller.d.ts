import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getAdminStats(): Promise<{
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalUsers: number;
        totalProducts: number;
        pendingKYC: number;
    }>;
    getSellerStats(req: any): Promise<{
        stats: ({
            id: string;
            title: string;
            value: string;
            growth: number;
            icon: string;
        } | {
            id: string;
            title: string;
            value: number;
            growth: number;
            icon: string;
        })[];
        recentOrders: {
            id: string;
            customer: string;
            amount: string;
            status: string;
        }[];
        products: {
            id: string;
            name: string;
            price: string;
            stock: number;
        }[];
    }>;
    getSellerRevenue(req: any, period: string): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
            fill: boolean;
            tension: number;
        }[];
    }>;
}
