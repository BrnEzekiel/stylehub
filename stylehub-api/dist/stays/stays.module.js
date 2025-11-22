"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaysModule = void 0;
const common_1 = require("@nestjs/common");
const stays_controller_1 = require("./stays.controller");
const stays_service_1 = require("./stays.service");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path_1 = require("path");
let StaysModule = class StaysModule {
};
exports.StaysModule = StaysModule;
exports.StaysModule = StaysModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    storage: (0, multer_1.diskStorage)({
                        destination: (req, file, cb) => {
                            const uploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'stays');
                            require('fs').mkdirSync(uploadDir, { recursive: true });
                            cb(null, uploadDir);
                        },
                        filename: (req, file, cb) => {
                            const ext = file.originalname.split('.').pop();
                            cb(null, `${(0, uuid_1.v4)()}.${ext}`);
                        },
                    }),
                    fileFilter: (req, file, cb) => {
                        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                            cb(null, true);
                        }
                        else {
                            cb(new Error('Only image files are allowed!'), false);
                        }
                    },
                    limits: {
                        fileSize: 5 * 1024 * 1024,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [stays_controller_1.StaysController],
        providers: [stays_service_1.StaysService],
        exports: [stays_service_1.StaysService],
    })
], StaysModule);
//# sourceMappingURL=stays.module.js.map