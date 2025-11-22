// src/products/products.controller.ts

import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  UseGuards, Request, Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminUpdateProductDto } from './dto/admin-update-product.dto';

@Controller('products')
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
    @UploadedFile() file: any,
  ) {
    return this.productsService.create(createProductDto, req.user.sub, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.sub);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
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

  // --- ADMIN ROUTES ---
  @Get('all-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }

  /**
   * 🛑 NEW: Admin Create Product Route
   * @route   POST /api/products/admin/create
   * @desc    Admin create a new product
   * @access  Private (Admin)
   */
  @Post('admin/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  adminCreate(
    @Body() createProductDto: CreateProductDto, // We can reuse the same DTO
    @UploadedFile() file: any,
  ) {
    // We pass 'null' for sellerId, as this is an admin-created product
    return this.productsService.adminCreateProduct(createProductDto, file, null);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  removeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.removeAdmin(id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() adminUpdateProductDto: AdminUpdateProductDto,
  ) {
    return this.productsService.adminUpdateProduct(id, adminUpdateProductDto);
  }
}