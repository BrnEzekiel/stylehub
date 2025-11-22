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
exports.ProviderPortfolioController = void 0;
const common_1 = require("@nestjs/common");
const provider_portfolio_service_1 = require("./provider-portfolio.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const fastify_multer_1 = require("@nest-lab/fastify-multer");
const submit_portfolio_dto_1 = require("./dto/submit-portfolio.dto");
const update_provider_portfolio_status_dto_1 = require("./dto/update-provider-portfolio-status.dto");
let ProviderPortfolioController = class ProviderPortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    getPortfolioStatus(req) {
        return this.portfolioService.getPortfolioStatus(req.user.sub);
    }
    submitPortfolio(req, dto, videoFile) {
        return this.portfolioService.submitPortfolio(req.user.sub, dto, videoFile);
    }
    getPendingPortfolios() {
        return this.portfolioService.getPendingPortfolios();
    }
    updatePortfolioStatus(id, dto) {
        return this.portfolioService.updatePortfolioStatus(id, dto.status);
    }
};
exports.ProviderPortfolioController = ProviderPortfolioController;
__decorate([
    (0, common_1.Get)('status'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ServiceProvider),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderPortfolioController.prototype, "getPortfolioStatus", null);
__decorate([
    (0, common_1.Post)('submit'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ServiceProvider),
    (0, common_1.UseInterceptors)((0, fastify_multer_1.FileInterceptor)('videoUrl')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_portfolio_dto_1.SubmitPortfolioDto, Object]),
    __metadata("design:returntype", void 0)
], ProviderPortfolioController.prototype, "submitPortfolio", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProviderPortfolioController.prototype, "getPendingPortfolios", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_provider_portfolio_status_dto_1.UpdateProviderPortfolioStatusDto]),
    __metadata("design:returntype", void 0)
], ProviderPortfolioController.prototype, "updatePortfolioStatus", null);
exports.ProviderPortfolioController = ProviderPortfolioController = __decorate([
    (0, common_1.Controller)('provider-portfolio'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [provider_portfolio_service_1.ProviderPortfolioService])
], ProviderPortfolioController);
//# sourceMappingURL=provider-portfolio.controller.js.map