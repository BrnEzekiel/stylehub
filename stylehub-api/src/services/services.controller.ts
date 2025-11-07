// src/services/services.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * @route   POST /api/services
   * @desc    Create a new service
   * @access  Private (ServiceProvider)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ServiceProvider)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Request() req,
    @Body() dto: CreateServiceDto,
    @UploadedFile() file: any,
  ) {
    return this.servicesService.create(req.user.sub, dto, file);
  }

  /**
   * @route   GET /api/services/my-services
   * @desc    Get all services for the logged-in provider
   * @access  Private (ServiceProvider)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ServiceProvider)
  @Get('my-services')
  findMyServices(@Request() req) {
    return this.servicesService.findByProvider(req.user.sub);
  }

  /**
   * @route   GET /api/services
   * @desc    Get all public services
   * @access  Public
   */
  @Get()
  findAll(@Query('category') category?: string) {
    return this.servicesService.findAll(category);
  }

  /**
   * @route   GET /api/services/:id
   * @desc    Get a single service by ID
   * @access  Public
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }
}