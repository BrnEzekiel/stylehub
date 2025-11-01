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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let StorageService = class StorageService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
            secure: true,
        });
    }
    async upload(fileBuffer, folder, resourceType = 'auto') {
        console.log(`[StorageService] Attempting to upload file to folder: ${folder}`);
        return new Promise((resolve, reject) => {
            const readableStream = new stream_1.Stream.Readable();
            readableStream.push(fileBuffer);
            readableStream.push(null);
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: folder,
                resource_type: resourceType,
            }, (error, result) => {
                console.log('[StorageService] Cloudinary response received.');
                if (error) {
                    console.error('[StorageService] Cloudinary Upload Error:', error);
                    return reject(error);
                }
                if (result) {
                    console.log('[StorageService] Cloudinary Upload Success.');
                    resolve(result);
                }
                else {
                    reject(new Error('Cloudinary upload failed to return a result.'));
                }
            });
            readableStream.pipe(uploadStream);
        });
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map