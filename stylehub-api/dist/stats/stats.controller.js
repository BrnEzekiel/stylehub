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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const stats_service_1 = require("./stats.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const role_enum_1 = require("../auth/enums/role.enum");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let StatsController = class StatsController {
    constructor(statsService) {
        this.statsService = statsService;
    }
    getAdminStats() {
        return this.statsService.getAdminDashboardStats();
    }
    getSellerStats(req) {
        const userId = req.user.userId;
        return this.statsService.getSellerDashboardStats(userId);
    }
    getSellerRevenue(req, period) {
        const userId = req.user.userId;
        return this.statsService.getSellerRevenueData(userId, period);
    }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)('admin-dashboard'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.Get)('seller-dashboard'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Seller),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getSellerStats", null);
__decorate([
    (0, common_1.Get)('seller-revenue'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Seller),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getSellerRevenue", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
//# sourceMappingURL=stats.controller.js.map