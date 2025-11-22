// src/orders/orders.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Request,
  InternalServerErrorException,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  StreamableFile,
  Res,
  Delete,
  BadRequestException, // 1. 🛑 Import
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // --- Client Routes ---
  @Get()
  @Roles(Role.Client)
  findClientOrders(@Request() req) {
    if (!req.user || !req.user.sub) {
      throw new InternalServerErrorException('User ID not found in token');
    }
    return this.ordersService.findOrdersByUserId(req.user.sub);
  }

  // --- Seller Routes ---
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  findSellerOrders(@Request() req) {
    if (!req.user || !req.user.sub) {
      throw new InternalServerErrorException('Seller ID not found in token');
    }
    return this.ordersService.findAllForSeller(req.user.sub);
  }
  
  /**
   * 2. 🛑 NEW: Seller updates an order status (e.g., to 'shipped')
   * @route   PATCH /api/orders/:id/seller-status
   */
  @Patch(':id/seller-status')
  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  updateSellerOrderStatus(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const sellerId = req.user.sub;
    const newStatus = updateOrderStatusDto.status;
    
    // Sellers can only mark as 'shipped' or 'cancelled'
    if (newStatus !== 'shipped' && newStatus !== 'cancelled') {
      throw new BadRequestException('Sellers can only update status to "shipped" or "cancelled".');
    }
    
    return this.ordersService.sellerUpdateOrderStatus(id, sellerId, newStatus);
  }

  // --- Admin Routes ---
  @Get('admin-all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @Get('admin-all/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  findAdminOrderDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findAdminOrderDetails(id);
  }

  @Patch('admin-all/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    // Admin can set any status
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto.status);
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  adminDeleteOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.adminDeleteOrder(id);
  }

  // --- Shared Route ---
  @Get(':id/receipt')
  @UseGuards(RolesGuard)
  @Roles(Role.Client, Role.Seller, Role.Admin)
  async downloadReceipt(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<StreamableFile> {
    
    const pdfBuffer = await this.ordersService.downloadReceipt(
      id,
      req.user.sub,
      req.user.role,
    );
    res.header('Content-Type', 'application/pdf');
    res.header(
      'Content-Disposition',
      `attachment; filename="StyleHub-Receipt-${id.substring(0, 8)}.pdf"`,
    );
    
    return new StreamableFile(pdfBuffer);
  }
}