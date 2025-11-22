// src/payouts/payouts.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('payouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin) // All routes in this module are Admin-only
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  /**
   * @route   GET /api/payouts/summary
   * @desc    Get high-level financial stats for the admin
   */
  @Get('summary')
  getFinancialSummary() {
    return this.payoutsService.getFinancialSummary();
  }

  /**
   * @route   GET /api/payouts/sellers
   * @desc    Get a list of all sellers and their unpaid earnings
   */
  @Get('sellers')
  getSellerPayoutSummaries() {
    return this.payoutsService.getSellerPayoutSummaries();
  }

  /**
   * @route   POST /api/payouts/create/:sellerId
   * @desc    Create a new payout for a seller's unpaid items
   */
  @Post('create/:sellerId')
  createPayout(@Param('sellerId', ParseUUIDPipe) sellerId: string) {
    return this.payoutsService.createPayout(sellerId);
  }

  /**
   * @route   PATCH /api/payouts/:payoutId/mark-paid
   * @desc    Mark a pending payout as paid
   */
  @Patch(':payoutId/mark-paid')
  markPayoutAsPaid(@Param('payoutId', ParseUUIDPipe) payoutId: string) {
    return this.payoutsService.markPayoutAsPaid(payoutId);
  }
}