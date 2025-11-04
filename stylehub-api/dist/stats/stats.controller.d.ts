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
}
