// src/kyc/kyc.controller.ts
import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  BadRequestException,
  Param,
  ParseUUIDPipe,
  Patch, // 1. Import Patch
} from '@nestjs/common';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { UpdateKycStatusDto } from './dto/update-kyc.dto'; // 2. Import new DTO

@Controller('kyc')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class KycController {
  constructor(private readonly kycService: KycService) {}

  // --- Seller Routes ---

  @Get()
  @Roles(Role.Seller, Role.ServiceProvider)
  async getKycStatus(@Request() req) {
    return this.kycService.getStatus(req.user.sub);
  }

  @Put('submit')
  @Roles(Role.Seller, Role.ServiceProvider)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'document', maxCount: 1 },
      { name: 'selfie', maxCount: 1 },
    ]),
  )
  async submitKyc(
    @Request() req,
    @Body() submitKycDto: SubmitKycDto,
  ) {
    const userId = req.user.sub;
    const files = req.files as { document?: any[], selfie?: any[] };
    const docFile = files?.document?.[0];
    const selfieFile = files?.selfie?.[0];

    if (!docFile || !selfieFile) {
      throw new BadRequestException('Both document and selfie files are required.');
    }

    return this.kycService.submitKyc(
      userId,
      submitKycDto.doc_type,
      docFile,
      selfieFile,
    );
  }

  // --- Admin Routes ---

  /**
   * @route   GET /api/kyc/pending
   * @desc    Get all pending KYC submissions
   * @access  Private (Admin)
   */
  @Get('pending')
  @Roles(Role.Admin) // 3. Admin only
  async getPendingSubmissions() {
    return this.kycService.getPendingSubmissions();
  }

  /**
   * @route   PATCH /api/kyc/:id/status
   * @desc    Approve or reject a KYC submission
   * @access  Private (Admin)
   */
  @Patch(':id/status')
  @Roles(Role.Admin) // 4. Admin only
  async updateKycStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateKycStatusDto: UpdateKycStatusDto,
  ) {
    return this.kycService.updateKycStatus(id, updateKycStatusDto.status);
  }
}