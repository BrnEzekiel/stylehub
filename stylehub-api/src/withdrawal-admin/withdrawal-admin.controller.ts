// src/withdrawal-admin/withdrawal-admin.controller.ts

import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WithdrawalAdminService } from './withdrawal-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';

@Controller('api/admin/withdrawals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin) // All routes are Admin-only
export class WithdrawalAdminController {
  constructor(private readonly adminService: WithdrawalAdminService) {}

  /**
   * @route   GET /api/admin/withdrawals
   * @desc    Get all withdrawal requests
   */
  @Get()
  getAllWithdrawalRequests() {
    return this.adminService.getAllWithdrawalRequests();
  }

  /**
   * @route   PATCH /api/admin/withdrawals/:id/status
   * @desc    Approve or reject a withdrawal request
   */
  @Patch(':id/status')
  updateWithdrawalStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWithdrawalDto,
  ) {
    return this.adminService.updateWithdrawalStatus(
      id,
      dto.status,
      dto.adminRemarks,
    );
  }
}