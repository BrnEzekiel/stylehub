import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProviderPortfolioService } from './provider-portfolio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { SubmitPortfolioDto } from './dto/submit-portfolio.dto';
import { UpdateProviderPortfolioStatusDto } from './dto/update-provider-portfolio-status.dto';

@Controller('provider-portfolio')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProviderPortfolioController {
  constructor(private readonly portfolioService: ProviderPortfolioService) {}

  @Get('status')
  @Roles(Role.ServiceProvider)
  getPortfolioStatus(@Request() req) {
    return this.portfolioService.getPortfolioStatus(req.user.sub);
  }

  @Post('submit')
  @Roles(Role.ServiceProvider)
  @UseInterceptors(FileInterceptor('videoUrl'))
  submitPortfolio(
    @Request() req,
    @Body() dto: SubmitPortfolioDto,
    @UploadedFile() videoFile: any,
  ) {
    return this.portfolioService.submitPortfolio(req.user.sub, dto, videoFile);
  }

  @Get('pending')
  @Roles(Role.Admin)
  getPendingPortfolios() {
    return this.portfolioService.getPendingPortfolios();
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  updatePortfolioStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProviderPortfolioStatusDto,
  ) {
    return this.portfolioService.updatePortfolioStatus(id, dto.status);
  }
}