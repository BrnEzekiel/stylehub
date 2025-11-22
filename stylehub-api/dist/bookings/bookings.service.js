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
const pdfkit_1 = require("pdfkit");
const fs = require("fs");
const path = require("path");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(clientId, dto) {
        if (!clientId)
            throw new common_1.BadRequestException('Client ID is required.');
        const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
        if (!service)
            throw new common_1.NotFoundException('Service not found.');
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
        const newBooking = await this.prisma.booking.create({
            data: {
                serviceId: dto.serviceId,
                clientId,
                providerId: service.providerId,
                scheduledAt: startTime,
                status: client_1.ServiceBookingStatus.pending,
                price,
                isHomeService: dto.isHomeService,
                paymentMethod: dto.paymentMethod,
            },
        });
        return newBooking;
    }
    async getClientBookings(clientId) {
        return this.prisma.booking.findMany({
            where: { clientId },
            include: {
                service: { select: { title: true, imageUrl: true } },
                provider: { select: { name: true } },
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }
    async getProviderBookings(providerId) {
        return this.prisma.booking.findMany({
            where: { providerId },
            include: {
                service: { select: { title: true } },
                client: { select: { name: true, email: true } },
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }
    async updateBookingStatus(bookingId, newStatus, userId, userRole) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        if (userRole !== 'admin' && booking.providerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this booking.');
        }
        return this.prisma.booking.update({ where: { id: bookingId }, data: { status: newStatus } });
    }
    async cancelBooking(bookingId, clientId) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        if (booking.clientId !== clientId)
            throw new common_1.ForbiddenException('You can only cancel your own bookings.');
        if (booking.status === client_1.ServiceBookingStatus.cancelled)
            throw new common_1.BadRequestException('Booking is already cancelled.');
        if (booking.status === client_1.ServiceBookingStatus.completed)
            throw new common_1.BadRequestException('Cannot cancel a completed booking.');
        return this.prisma.booking.update({ where: { id: bookingId }, data: { status: client_1.ServiceBookingStatus.cancelled } });
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
    async downloadConfirmation(bookingId, clientId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                client: { select: { name: true, email: true, phone: true } },
                service: { select: { title: true, description: true, durationMinutes: true } },
                provider: { select: { name: true, email: true, phone: true } },
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.clientId !== clientId)
            throw new common_1.ForbiddenException('You can only download your own booking confirmations.');
        return this.generateConfirmationPDF(booking);
    }
    generateConfirmationPDF(booking) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ size: 'A4', margin: 50, font: 'Helvetica' });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);
                try {
                    const { applyWatermark } = require('../utils/pdfUtils');
                    applyWatermark(doc);
                }
                catch (e) {
                }
                const headerY = 50;
                const logoPath = path.resolve(process.cwd(), '../stylehub-client/public/logo192.png');
                if (fs.existsSync(logoPath)) {
                    try {
                        doc.image(logoPath, 50, headerY, { width: 60 });
                    }
                    catch (e) { }
                }
                doc.font('Helvetica-Bold').fontSize(20).fillColor('#222').text('StyleHub', 130, headerY + 6);
                doc.font('Helvetica').fontSize(12).fillColor('#666').text('Booking Confirmation', 130, headerY + 36);
                const createdAt = booking?.createdAt ? new Date(booking.createdAt) : new Date();
                doc.font('Helvetica').fontSize(10).fillColor('#444').text(`Date: ${createdAt.toLocaleString()}`, 50, headerY + 6, { align: 'right', width: 495 });
                doc.moveTo(50, headerY + 90).lineTo(545, headerY + 90).strokeColor('#eeeeee').stroke();
                const startX = 50;
                const colGap = 20;
                const colWidth = (545 - startX - colGap) / 2;
                const leftX = startX;
                const rightX = startX + colWidth + colGap;
                let cursorY = headerY + 110;
                doc.rect(leftX - 6, cursorY - 6, colWidth + 12, 80).strokeColor('#f0f0f0').stroke();
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Service Details', leftX, cursorY);
                cursorY += 18;
                doc.font('Helvetica-Bold').fontSize(11).fillColor('#333').text(booking.service?.title || 'N/A', leftX, cursorY, { width: colWidth });
                const titleH = doc.heightOfString(booking.service?.title || 'N/A', { width: colWidth });
                cursorY += titleH + 6;
                if (booking.service?.description) {
                    doc.font('Helvetica').fontSize(10).fillColor('#555').text(booking.service.description, leftX, cursorY, { width: colWidth });
                    const descH = doc.heightOfString(booking.service.description, { width: colWidth });
                    cursorY += descH + 6;
                }
                if (booking.service?.durationMinutes) {
                    doc.font('Helvetica').fontSize(10).fillColor('#333').text('Duration: ', leftX, cursorY, { continued: true });
                    doc.font('Helvetica-Bold').text(`${booking.service.durationMinutes} minutes`);
                    cursorY += 14;
                }
                let rightCursorY = headerY + 110;
                doc.rect(rightX - 6, rightCursorY - 6, colWidth + 12, 120).strokeColor('#f0f0f0').stroke();
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Booking Information', rightX, rightCursorY);
                rightCursorY += 18;
                const rawId = booking.id || '';
                const displayId = rawId.length > 12 ? `${rawId.substring(0, 12)}...` : rawId;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Booking ID: ', rightX, rightCursorY, { continued: true });
                doc.font('Helvetica-Bold').text(displayId);
                rightCursorY += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Status: ', rightX, rightCursorY, { continued: true });
                doc.font('Helvetica-Bold').fillColor(booking.status === 'cancelled' ? '#d9534f' : booking.status === 'confirmed' ? '#28a745' : '#0f35df').text(`${booking.status}`);
                rightCursorY += 14;
                const serviceDate = booking.scheduledAt ? new Date(booking.scheduledAt) : null;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Service Date: ', rightX, rightCursorY, { continued: true });
                doc.font('Helvetica-Bold').text(`${serviceDate ? serviceDate.toLocaleDateString() : 'N/A'}`);
                rightCursorY += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Service Time: ', rightX, rightCursorY, { continued: true });
                doc.font('Helvetica-Bold').text(`${serviceDate ? serviceDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}`);
                rightCursorY += 14;
                const providerY = Math.max(cursorY, rightCursorY) + 8;
                doc.rect(leftX - 6, providerY - 6, colWidth + 12, 80).strokeColor('#f0f0f0').stroke();
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Provider', leftX, providerY);
                let pY = providerY + 18;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Name: ', leftX, pY, { continued: true });
                doc.font('Helvetica-Bold').text(booking.provider?.name || 'N/A');
                pY += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Email: ', leftX, pY, { continued: true });
                doc.font('Helvetica-Bold').text(booking.provider?.email || 'N/A');
                pY += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Phone: ', leftX, pY, { continued: true });
                doc.font('Helvetica-Bold').text(booking.provider?.phone || 'N/A');
                const clientY = providerY;
                doc.rect(rightX - 6, clientY - 6, colWidth + 12, 80).strokeColor('#f0f0f0').stroke();
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Client', rightX, clientY);
                let cY = clientY + 18;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Name: ', rightX, cY, { continued: true });
                doc.font('Helvetica-Bold').text(booking.client?.name || 'N/A');
                cY += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Email: ', rightX, cY, { continued: true });
                doc.font('Helvetica-Bold').text(booking.client?.email || 'N/A');
                cY += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Phone: ', rightX, cY, { continued: true });
                doc.font('Helvetica-Bold').text(booking.client?.phone || 'N/A');
                const paymentY = Math.max(pY, cY) + 12;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Payment Method: ', leftX, paymentY, { continued: true });
                const paymentMethod = booking.paymentMethod || 'cash_on_delivery';
                doc.font('Helvetica-Bold').text(`${paymentMethod.replace('_', ' ')}`);
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Location: ', rightX, paymentY, { continued: true });
                const locationLabel = booking.isHomeService ? 'Home Service' : 'Provider Location';
                doc.font('Helvetica-Bold').text(`${locationLabel}`);
                const price = typeof booking.price === 'string' ? parseFloat(booking.price) : booking.price;
                const boxWidth = 180;
                const boxX = 545 - boxWidth;
                const boxY = paymentY + 60;
                doc.rect(boxX, boxY, boxWidth, 60).fillOpacity(0.03).fillAndStroke('#fafafa', '#eee');
                doc.fillOpacity(1);
                doc.fontSize(12).fillColor('#444').text('Total', boxX + 10, boxY + 12);
                doc.fontSize(16).fillColor('#fa0f8c').text(`KSh ${price.toFixed(2)}`, boxX + 10, boxY + 28);
                doc.fontSize(10).fillColor('#999').text('Thank you for booking with StyleHub!', 50, 780, { align: 'center' });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map