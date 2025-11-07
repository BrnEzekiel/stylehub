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
exports.KycController = void 0;
const common_1 = require("@nestjs/common");
const kyc_service_1 = require("./kyc.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const fastify_multer_1 = require("@nest-lab/fastify-multer");
const submit_kyc_dto_1 = require("./dto/submit-kyc.dto");
const update_kyc_dto_1 = require("./dto/update-kyc.dto");
let KycController = class KycController {
    constructor(kycService) {
        this.kycService = kycService;
    }
    async getKycStatus(req) {
        return this.kycService.getStatus(req.user.sub);
    }
    async submitKyc(req, submitKycDto) {
        const userId = req.user.sub;
        const files = req.files;
        const docFile = files?.document?.[0];
        const selfieFile = files?.selfie?.[0];
        if (!docFile || !selfieFile) {
            throw new common_1.BadRequestException('Both document and selfie files are required.');
        }
        return this.kycService.submitKyc(userId, submitKycDto.doc_type, docFile, selfieFile);
    }
    async getPendingSubmissions() {
        return this.kycService.getPendingSubmissions();
    }
    async updateKycStatus(id, updateKycStatusDto) {
        return this.kycService.updateKycStatus(id, updateKycStatusDto.status);
    }
};
exports.KycController = KycController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Seller, role_enum_1.Role.ServiceProvider),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getKycStatus", null);
__decorate([
    (0, common_1.Put)('submit'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Seller, role_enum_1.Role.ServiceProvider),
    (0, common_1.UseInterceptors)((0, fastify_multer_1.FileFieldsInterceptor)([
        { name: 'document', maxCount: 1 },
        { name: 'selfie', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_kyc_dto_1.SubmitKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "submitKyc", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getPendingSubmissions", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kyc_dto_1.UpdateKycStatusDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "updateKycStatus", null);
exports.KycController = KycController = __decorate([
    (0, common_1.Controller)('api/kyc'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [kyc_service_1.KycService])
], KycController);
//# sourceMappingURL=kyc.controller.js.map