// src/wishlist/wishlist.controller.ts

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Client) // All routes are for Clients only
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  /**
   * @route   GET /api/wishlist
   * @desc    Get all items in the user's wishlist
   */
  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.sub);
  }

  /**
   * @route   GET /api/wishlist/ids
   * @desc    Get just the IDs of products in the user's wishlist
   */
  @Get('ids')
  getWishlistProductIds(@Request() req) {
    return this.wishlistService.getWishlistProductIds(req.user.sub);
  }

  /**
   * @route   POST /api/wishlist/:productId
   * @desc    Add an item to the wishlist
   */
  @Post(':productId')
  addItem(
    @Request() req,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.wishlistService.addWishlistItem(req.user.sub, productId);
  }

  /**
   * @route   DELETE /api/wishlist/:productId
   * @desc    Remove an item from the wishlist
   */
  @Delete(':productId')
  removeItem(
    @Request() req,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.wishlistService.removeWishlistItem(req.user.sub, productId);
  }
}