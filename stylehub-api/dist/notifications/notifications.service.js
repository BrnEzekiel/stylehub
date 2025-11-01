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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async handleOrderPaid(order) {
        this.logger.log(`Received 'order.paid' event for Order ID: ${order.id}`);
        try {
            const orderDetails = await this.prisma.order.findUnique({
                where: { id: order.id },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    sellerId: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!orderDetails || !orderDetails.items.length) {
                this.logger.warn(`Order ${order.id} not found or has no items. No notification created.`);
                return;
            }
            const sellerId = orderDetails.items[0].product.sellerId;
            if (!sellerId) {
                this.logger.warn(`Order ${order.id} has no seller. No notification created.`);
                return;
            }
            const messageToSeller = `You have a new order (#${order.id.substring(0, 8)}) for $${order.totalAmount}.`;
            const notification = await this.prisma.notification.create({
                data: {
                    userId: sellerId,
                    type: 'ORDER_PAID',
                    message: messageToSeller,
                    orderId: order.id,
                },
            });
            this.logger.log(`Notification ${notification.type} created for user ${sellerId}`);
        }
        catch (error) {
            this.logger.error(`Failed to handle 'order.paid' event for Order ID: ${order.id}`, error.stack);
        }
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, event_emitter_1.OnEvent)('order.paid', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "handleOrderPaid", null);
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map