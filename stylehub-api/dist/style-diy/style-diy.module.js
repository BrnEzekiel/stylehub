"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleDIYModule = void 0;
const common_1 = require("@nestjs/common");
const style_diy_controller_1 = require("./style-diy.controller");
const style_diy_service_1 = require("./style-diy.service");
const prisma_module_1 = require("../prisma/prisma.module");
const storage_module_1 = require("../storage/storage.module");
let StyleDIYModule = class StyleDIYModule {
};
exports.StyleDIYModule = StyleDIYModule;
exports.StyleDIYModule = StyleDIYModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, storage_module_1.StorageModule],
        controllers: [style_diy_controller_1.StyleDIYController],
        providers: [style_diy_service_1.StyleDIYService],
        exports: [style_diy_service_1.StyleDIYService],
    })
], StyleDIYModule);
//# sourceMappingURL=style-diy.module.js.map