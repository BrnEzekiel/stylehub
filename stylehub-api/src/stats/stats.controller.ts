// src/stats/stats.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * @route   GET /api/stats/admin-dashboard
   * @desc    Get main statistics for the admin dashboard
   * @access  Private (Admin)
   */
  @Get('admin-dashboard')
  getAdminStats() {
    return this.statsService.getAdminDashboardStats();
  }
}