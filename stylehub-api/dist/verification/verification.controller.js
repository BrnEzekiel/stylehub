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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const common_1 = require("@nestjs/common");
const verification_service_1 = require("./verification.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const fastify_multer_1 = require("@nest-lab/fastify-multer");
const submit_verification_dto_1 = require("./dto/submit-verification.dto");
const update_verification_dto_1 = require("./dto/update-verification.dto");
let VerificationController = class VerificationController {
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    getVerificationStatus(req) {
        return this.verificationService.getVerificationStatus(req.user.sub);
    }
    submitVerification(req, dto, businessLicense) {
        return this.verificationService.submitVerification(req.user.sub, dto, businessLicense);
    }
    getPendingVerifications() {
        return this.verificationService.getPendingVerifications();
    }
    updateVerificationStatus(id, dto) {
        return this.verificationService.updateVerificationStatus(id, dto.status);
    }
};
exports.VerificationController = VerificationController;
__decorate([
    (0, common_1.Get)('status'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Seller),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "getVerificationStatus", null);
__decorate([
    (0, common_1.Post)('submit'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Seller),
    (0, common_1.UseInterceptors)((0, fastify_multer_1.FileInterceptor)('businessLicense')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_verification_dto_1.SubmitVerificationDto, Object]),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "submitVerification", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "getPendingVerifications", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_verification_dto_1.UpdateVerificationStatusDto]),
    __metadata("design:returntype", void 0)
], VerificationController.prototype, "updateVerificationStatus", null);
exports.VerificationController = VerificationController = __decorate([
    (0, common_1.Controller)('api/verification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [verification_service_1.VerificationService])
], VerificationController);
//# sourceMappingURL=verification.controller.js.map