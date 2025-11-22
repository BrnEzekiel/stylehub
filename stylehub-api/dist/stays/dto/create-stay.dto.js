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
exports.CreateStayDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateStayDto {
}
exports.CreateStayDto = CreateStayDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the stay', example: 'Cozy Apartment in Downtown' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of the stay', example: 'A beautiful and cozy apartment located in the heart of the city...' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StayType, description: 'Type of the stay' }),
    (0, class_validator_1.IsEnum)(client_1.StayType),
    __metadata("design:type", String)
], CreateStayDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price per month in local currency', example: 1200 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateStayDto.prototype, "pricePerMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full address of the stay', example: '123 Main St, Anytown, AN 12345' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City where the stay is located', example: 'Nairobi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State or region where the stay is located', example: 'Nairobi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country where the stay is located', example: 'Kenya' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude coordinate of the stay location', example: -1.2921, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateStayDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude coordinate of the stay location', example: 36.8219, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateStayDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum number of occupants allowed', example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateStayDto.prototype, "maxOccupants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date from when the stay is available (ISO string)', example: '2025-01-01T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "availableFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date until when the stay is available (ISO string)',
        example: '2025-12-31T23:59:59.999Z',
        required: false
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "availableTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        enum: Object.values(client_1.AmenityType),
        description: 'List of amenities available at the stay',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(Object.values(client_1.AmenityType), { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStayDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional rules or notes for guests',
        example: 'No smoking, No pets allowed',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "houseRules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cancellation policy for the stay',
        example: 'Free cancellation up to 7 days before check-in',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Check-in time in 24-hour format',
        example: '14:00',
        required: false,
        default: '14:00'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "checkInTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Check-out time in 24-hour format',
        example: '11:00',
        required: false,
        default: '11:00'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStayDto.prototype, "checkOutTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the stay is currently available for booking',
        example: true,
        default: true,
        required: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStayDto.prototype, "isAvailable", void 0);
//# sourceMappingURL=create-stay.dto.js.map