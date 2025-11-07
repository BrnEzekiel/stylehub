"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalAdminModule = void 0;
const common_1 = require("@nestjs/common");
const withdrawal_admin_service_1 = require("./withdrawal-admin.service");
const withdrawal_admin_controller_1 = require("./withdrawal-admin.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
let WithdrawalAdminModule = class WithdrawalAdminModule {
};
exports.WithdrawalAdminModule = WithdrawalAdminModule;
exports.WithdrawalAdminModule = WithdrawalAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [withdrawal_admin_service_1.WithdrawalAdminService],
        controllers: [withdrawal_admin_controller_1.WithdrawalAdminController],
    })
], WithdrawalAdminModule);
//# sourceMappingURL=withdrawal-admin.module.js.map