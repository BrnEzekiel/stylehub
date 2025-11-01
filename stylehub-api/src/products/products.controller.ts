// src/products/products.controller.ts

import { 
  Controller, Get, Post, Body, Param, Patch, Delete, 
  UseGuards, Request, Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common'; // 1. 🛑 Removed RolesGuard from this import
import { FileInterceptor } from '@nest-lab/fastify-multer'; 
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto'; 
import { UpdateProductDto } from './dto/update-product.dto'; 
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth/guards/roles.guard'; // 2. 🛑 Added the correct import path
import { Roles } from '../auth/decorators/roles.decorator'; 
import { Role } from '../auth/enums/role.enum'; 

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- Seller Routes (Existing) ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Post()
  @UseInterceptors(FileInterceptor('image')) 
  create(
    @Body() createProductDto: CreateProductDto, 
    @Request() req,
    @UploadedFile() file: any 
  ) {
    return this.productsService.create(createProductDto, req.user.sub, file); 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req
  ) {
    return this.productsService.update(id, updateProductDto, req.user.sub); 
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req
  ) {
    return this.productsService.remove(id, req.user.sub);
  }

  // --- Public Routes (Existing) ---

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  // --- NEW ADMIN ROUTES ---

  /**
   * @route   GET /api/products/all-admin
   * @desc    Get all products from all sellers
   * @access  Private (Admin)
   */
  @Get('all-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }

  /**
   * @route   DELETE /api/products/admin/:id
   * @desc    Admin delete any product
   * @access  Private (Admin)
   */
  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  removeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    // This calls a new service method that bypasses ownership checks
    return this.productsService.removeAdmin(id);
  }
}