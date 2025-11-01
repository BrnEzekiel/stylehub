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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(PaymentService_1.name);
    }
    async createPaymentIntent(userId, dto) {
        this.logger.log(`Creating payment intent for order ${dto.orderId} by user ${userId}`);
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: dto.orderId, userId: userId },
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${dto.orderId} not found or does not belong to user.`);
            }
            if (order.status !== 'pending') {
                throw new common_1.InternalServerErrorException(`Order ${dto.orderId} is not pending, cannot create payment intent.`);
            }
            const amountInCents = Number(order.totalAmount) * 100;
            const paymentIntentId = `simulated_pi_${Date.now()}`;
            const clientSecret = `simulated_secret_${order.id}`;
            this.logger.log(`Payment intent ${paymentIntentId} created for order ${dto.orderId}`);
            return {
                orderId: order.id,
                amount: amountInCents,
                currency: 'kes',
                paymentId: paymentIntentId,
                clientSecret: clientSecret,
            };
        }
        catch (error) {
            this.logger.error(`Failed to create payment intent for order ${dto.orderId}:`, error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Could not create payment intent.');
        }
    }
    async confirmPayment(orderId, paymentId) {
        this.logger.log(`Confirming payment ${paymentId} for order ${orderId}`);
        if (!orderId || !paymentId || !paymentId.startsWith('simulated_pi_')) {
            throw new common_1.InternalServerErrorException('Invalid confirmation data.');
        }
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId }
            });
            if (!order) {
                throw new common_1.NotFoundException(`Order ${orderId} not found during payment confirmation.`);
            }
            if (order.status === 'paid') {
                this.logger.warn(`Order ${orderId} is already paid. Ignoring confirmation.`);
                return { message: "Order already marked as paid.", order };
            }
            if (order.status !== 'pending') {
                throw new common_1.InternalServerErrorException(`Order ${orderId} status is ${order.status}, cannot confirm payment.`);
            }
            const updatedOrder = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'paid' },
            });
            this.logger.log(`Order ${orderId} status updated to paid.`);
            this.eventEmitter.emit('order.paid', updatedOrder);
            this.logger.log(`Event 'order.paid' emitted for order ${orderId}`);
            return {
                message: "Payment confirmed and order status updated. Notification enqueued.",
                order: updatedOrder
            };
        }
        catch (error) {
            this.logger.error(`Failed to confirm payment for order ${orderId}:`, error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Could not confirm payment or update order.');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], PaymentService);
//# sourceMappingURL=payment.service.js.map