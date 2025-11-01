// src/orders/orders.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Request,
  InternalServerErrorException,
  Patch, // 1. Import Patch
  Param, // 2. Import Param
  Body, // 3. Import Body
  ParseUUIDPipe, // 4. Import ParseUUIDPipe
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'; // 5. Import new DTO

@Controller('api/orders')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * @route   GET /api/orders
   * @desc    Get all orders for the logged-in CLIENT
   */
  @Get()
  @Roles(Role.Client)
  findClientOrders(@Request() req) {
    if (!req.user || !req.user.sub) {
      throw new InternalServerErrorException('User ID not found in token');
    }
    return this.ordersService.findOrdersByUserId(req.user.sub);
  }

  /**
   * @route   GET /api/orders/all
   * @desc    Get all orders + summary for the logged-in SELLER
   */
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
   * @route   GET /api/orders/admin-all
   * @desc    Get all orders from all users
   */
  @Get('admin-all')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  /**
   * 🛑 NEW ADMIN ROUTE 🛑
   * @route   PATCH /api/orders/admin-all/:id/status
   * @desc    Admin updates any order's status
   */
  @Patch('admin-all/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto.status);
  }
}