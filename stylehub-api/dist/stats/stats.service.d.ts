import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminDashboardStats(): Promise<{
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalUsers: number;
        totalProducts: number;
        pendingKYC: number;
    }>;
}
