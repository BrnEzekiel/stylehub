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
exports.CreateStayBookingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateStayBookingDto {
}
exports.CreateStayBookingDto = CreateStayBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the stay to book', example: 'uuid-string' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStayBookingDto.prototype, "stayId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Check-in date (ISO string)', example: '2025-01-15T14:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStayBookingDto.prototype, "checkInDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Check-out date (ISO string)', example: '2025-01-20T11:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStayBookingDto.prototype, "checkOutDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of guests', example: 2, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateStayBookingDto.prototype, "guestCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Special requests or notes',
        example: 'Late check-in requested',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayBookingDto.prototype, "specialRequests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.PaymentMethod,
        description: 'Payment method for the booking',
        example: client_1.PaymentMethod.CARD,
        required: false
    }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayBookingDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency for the booking',
        example: 'KES',
        default: 'KES',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayBookingDto.prototype, "currency", void 0);
//# sourceMappingURL=create-stay-booking.dto.js.map