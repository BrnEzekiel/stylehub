// src/wallet/wallet.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { WithdrawalRequestDto } from './dto/withdrawal.dto';

@Controller('api/wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Seller) // These routes are for sellers
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * @route   GET /api/wallet
   * @desc    Get seller's wallet balance and transaction history
   */
  @Get()
  getWalletDetails(@Request() req) {
    return this.walletService.getWalletDetails(req.user.sub);
  }

  /**
   * @route   POST /api/wallet/withdraw
   * @desc    Seller requests a withdrawal from their wallet
   */
  @Post('withdraw')
  requestWithdrawal(
    @Request() req,
    @Body() dto: WithdrawalRequestDto,
  ) {
    return this.walletService.requestWithdrawal(req.user.sub, dto);
  }
}