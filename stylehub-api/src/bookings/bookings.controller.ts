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
  Res,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServiceBookingStatus } from '@prisma/client';
// Add this import
import { UnauthorizedException, StreamableFile } from '@nestjs/common';
import { FastifyReply } from 'fastify';
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * @route   POST /api/bookings
   * @desc    Create a new booking (Client)
   */
  // src/bookings/bookings.controller.ts
@Post()
@Roles(Role.Client)
createBooking(@Request() req, @Body() dto: CreateBookingDto) {
  // 🔥 Ensure user ID is present
  if (!req.user?.sub) {
    throw new UnauthorizedException('User ID not found in token');
  }
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
  updateServiceBookingStatus(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ServiceBookingStatus,
  ) {
    if (!status) throw new BadRequestException('Status is required.');
    return this.bookingsService.updateBookingStatus(id, status, req.user.sub, req.user.role);
  }

  /**
   * @route   PATCH /api/bookings/:id/cancel
   * @desc    Cancel a booking (Client only)
   */
  @Patch(':id/cancel')
  @Roles(Role.Client)
  cancelBooking(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.cancelBooking(id, req.user.sub);
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

  /**
   * @route   GET /api/bookings/:id/confirmation
   * @desc    Download booking confirmation PDF
   */
  @Get(':id/confirmation')
  async downloadConfirmation(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.bookingsService.downloadConfirmation(
      id,
      req.user.sub,
    );
    res.header('Content-Type', 'application/pdf');
    res.header(
      'Content-Disposition',
      `attachment; filename="BookingConfirmation-${id.substring(0, 8)}.pdf"`,
    );
    return new StreamableFile(pdfBuffer);
  }
}