// src/bookings/bookings.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new booking (Client) — WALLET HOLD REMOVED FOR TESTING
   */
  async createBooking(clientId: string, dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    // Determine price
    let price: Prisma.Decimal;
    if (dto.isHomeService) {
      if (!service.offersHome || !service.priceHomeCents) {
        throw new BadRequestException('This service is not available for home booking.');
      }
      price = service.priceHomeCents;
    } else {
      price = service.priceShopCents;
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

    // ✅ CREATE BOOKING WITHOUT WALLET ESCROW
    const newBooking = await this.prisma.booking.create({
      data: {
        serviceId: service.id,
        clientId: clientId,
        providerId: service.providerId,
        startTime: startTime,
        endTime: endTime,
        status: BookingStatus.pending,
        price: price,
        isHomeService: dto.isHomeService,
      },
    });

    return newBooking;
  }

  /**
   * Get all bookings for a client
   */
  async getClientBookings(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: {
        service: {
          select: { title: true, imageUrl: true },
        },
        provider: {
          select: { name: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  /**
   * Get all bookings for a provider
   */
  async getProviderBookings(providerId: string) {
    return this.prisma.booking.findMany({
      where: { providerId },
      include: {
        service: {
          select: { title: true },
        },
        client: {
          select: { name: true, email: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  /**
   * Update booking status (Provider or Admin)
   */
  async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    userId: string,
    userRole: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    if (userRole !== 'admin' && booking.providerId !== userId) {
      throw new ForbiddenException('You do not have permission to update this booking.');
    }

    // ✅ NO WALLET RELEASE — just update status
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });
  }

  /**
   * Get all bookings (Admin)
   */
  async getAllBookingsAdmin() {
    return this.prisma.booking.findMany({
      include: {
        service: { select: { title: true } },
        client: { select: { name: true, email: true } },
        provider: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}