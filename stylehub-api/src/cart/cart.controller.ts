import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Param,
  ParseUUIDPipe, // 1. Import ParseUUIDPipe for validation
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddItemDto } from './dto/add-item.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('api/cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('checkout')
  @Roles(Role.Client)
  checkout(@Request() req) {
    return this.cartService.checkout(req.user.sub);
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

  // 🛑 FIX: Changed route from :productId to :cartItemId
  @Delete(':cartItemId') 
  @Roles(Role.Client)
  removeItem(
    @Request() req, 
    // 2. Get the cartItemId from the URL
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string 
  ) {
    // 3. Pass the specific cartItemId to the service
    return this.cartService.removeItem(req.user.sub, cartItemId);
  }
}
