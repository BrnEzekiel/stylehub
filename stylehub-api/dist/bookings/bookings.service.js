"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(clientId, dto) {
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found.');
        }
        let price;
        if (dto.isHomeService) {
            if (!service.offersHome || !service.priceHomeCents) {
                throw new common_1.BadRequestException('This service is not available for home booking.');
            }
            price = service.priceHomeCents;
        }
        else {
            price = service.priceShopCents;
        }
        const startTime = new Date(dto.startTime);
        const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);
        const newBooking = await this.prisma.booking.create({
            data: {
                serviceId: service.id,
                clientId: clientId,
                providerId: service.providerId,
                startTime: startTime,
                endTime: endTime,
                status: client_1.BookingStatus.pending,
                price: price,
                isHomeService: dto.isHomeService,
            },
        });
        return newBooking;
    }
    async getClientBookings(clientId) {
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
    async getProviderBookings(providerId) {
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
    async updateBookingStatus(bookingId, newStatus, userId, userRole) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found.');
        }
        if (userRole !== 'admin' && booking.providerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this booking.');
        }
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: newStatus },
        });
    }
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map