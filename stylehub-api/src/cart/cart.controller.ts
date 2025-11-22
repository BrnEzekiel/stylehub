// src/cart/cart.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddItemDto } from './dto/add-item.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('checkout')
  @Roles(Role.Client)
  checkout(
    @Request() req,
    @Body() checkoutDto: CheckoutDto,
  ) {
    return this.cartService.checkout(req.user.sub, checkoutDto);
  }

  @Post()
  @Roles(Role.Client)
  addItem(@Request() req, @Body() addItemDto: AddItemDto) {
    return this.cartService.addItemToCart(req.user.sub, addItemDto);
  }

  @Get()
  @Roles(Role.Client)
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.sub);
  }

  @Delete(':cartItemId') 
  @Roles(Role.Client)
  removeItem(
    @Request() req, 
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string 
  ) {
    return this.cartService.removeItem(req.user.sub, cartItemId);
  }
}