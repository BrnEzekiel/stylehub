// src/stats/stats.controller.ts

import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * @route   GET /api/stats/admin-dashboard
   * @desc    Get main statistics for the admin dashboard
   * @access  Private (Admin)
   */
  @Get('admin-dashboard')
  @Roles(Role.Admin)
  getAdminStats() {
    return this.statsService.getAdminDashboardStats();
  }

  /**
   * @route   GET /api/stats/seller-dashboard
   * @desc    Get main statistics for the seller dashboard
   * @access  Private (Seller)
   */
  @Get('seller-dashboard')
  @Roles(Role.Seller)
  getSellerStats(@Request() req) {
    const userId = req.user.userId;
    return this.statsService.getSellerDashboardStats(userId);
  }

  /**
   * @route   GET /api/stats/seller-revenue
   * @desc    Get revenue data for seller dashboard based on period
   * @access  Private (Seller)
   */
  @Get('seller-revenue')
  @Roles(Role.Seller)
  getSellerRevenue(
    @Request() req,
    @Query('period') period: string,
  ) {
    const userId = req.user.userId;
    return this.statsService.getSellerRevenueData(userId, period);
  }
}