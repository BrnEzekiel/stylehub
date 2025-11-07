// src/bookings/bookings.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Controller('api/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * @route   POST /api/bookings
   * @desc    Create a new booking (Client)
   */
  @Post()
  @Roles(Role.Client)
  createBooking(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.sub, dto);
  }

  /**
   * @route   GET /api/bookings/my-bookings
   * @desc    Get all bookings for the logged-in client
   */
  @Get('my-bookings')
  @Roles(Role.Client)
  getClientBookings(@Request() req) {
    return this.bookingsService.getClientBookings(req.user.sub);
  }

  /**
   * @route   GET /api/bookings/my-provider-bookings
   * @desc    Get all bookings for the logged-in provider
   */
  @Get('my-provider-bookings')
  @Roles(Role.ServiceProvider)
  getProviderBookings(@Request() req) {
    return this.bookingsService.getProviderBookings(req.user.sub);
  }

  /**
   * @route   PATCH /api/bookings/:id/status
   * @desc    Update a booking status (Provider or Admin)
   */
  @Patch(':id/status')
  @Roles(Role.ServiceProvider, Role.Admin)
  updateBookingStatus(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: BookingStatus,
  ) {
    if (!status) throw new BadRequestException('Status is required.');
    return this.bookingsService.updateBookingStatus(id, status, req.user.sub, req.user.role);
  }

  /**
   * @route   GET /api/bookings/admin-all
   * @desc    Get all bookings (Admin)
   */
  @Get('admin-all')
  @Roles(Role.Admin)
  getAllBookingsAdmin() {
    return this.bookingsService.getAllBookingsAdmin();
  }
}