// src/verification/verification.controller.ts

import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch, // 1. 🛑 Import Patch
  Param, // 2. 🛑 Import Param
  ParseUUIDPipe, // 3. 🛑 Import ParseUUIDPipe
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification.dto'; // 4. 🛑 Import DTO

@Controller('verification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  // --- Seller Routes ---

  /**
   * @route   GET /api/verification/status
   * @desc    Get the seller's current verification status
   */
  @Get('status')
  @Roles(Role.Seller)
  getVerificationStatus(@Request() req) {
    return this.verificationService.getVerificationStatus(req.user.sub);
  }

  /**
   * @route   POST /api/verification/submit
   * @desc    Submit verification documents
   */
  @Post('submit')
  @Roles(Role.Seller)
  @UseInterceptors(FileInterceptor('businessLicense'))
  submitVerification(
    @Request() req,
    @Body() dto: SubmitVerificationDto,
    @UploadedFile() businessLicense: any,
  ) {
    return this.verificationService.submitVerification(
      req.user.sub,
      dto,
      businessLicense,
    );
  }

  // --- 🛑 NEW: Admin Routes ---

  /**
   * @route   GET /api/verification/pending
   * @desc    Get all pending verification submissions
   * @access  Private (Admin)
   */
  @Get('pending')
  @Roles(Role.Admin)
  getPendingVerifications() {
    return this.verificationService.getPendingVerifications();
  }

  /**
   * @route   PATCH /api/verification/:id/status
   * @desc    Approve or reject a verification submission
   * @access  Private (Admin)
   */
  @Patch(':id/status')
  @Roles(Role.Admin)
  updateVerificationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVerificationStatusDto,
  ) {
    return this.verificationService.updateVerificationStatus(id, dto.status);
  }
}