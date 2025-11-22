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
exports.StaysController = void 0;
const common_1 = require("@nestjs/common");
const stays_service_1 = require("./stays.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_stay_dto_1 = require("./dto/create-stay.dto");
const update_stay_dto_1 = require("./dto/update-stay.dto");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
let StaysController = class StaysController {
    constructor(staysService) {
        this.staysService = staysService;
    }
    async create(req, createStayDto, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one image is required');
        }
        return this.staysService.create(req.user.sub, createStayDto, files);
    }
    async findAll(city, minPrice, maxPrice, type, page = 1, limit = 10) {
        return this.staysService.findAll({
            city,
            minPrice,
            maxPrice,
            type: type,
            page: Number(page),
            limit: Number(limit),
        });
    }
    async search(query, page = 1, limit = 10) {
        if (!query) {
            throw new common_1.BadRequestException('Search query is required');
        }
        return this.staysService.search(query, Number(page), Number(limit));
    }
    async findUserStays(req, page = 1, limit = 10) {
        return this.staysService.findByOwner(req.user.sub, Number(page), Number(limit));
    }
    async findOne(id) {
        return this.staysService.findOne(id);
    }
    async update(req, id, updateStayDto) {
        return this.staysService.update(req.user.sub, id, updateStayDto);
    }
    async remove(req, id) {
        return this.staysService.remove(req.user.sub, id);
    }
    async addImages(req, id, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one image is required');
        }
        return this.staysService.addImages(req.user.sub, id, files);
    }
    async setPrimaryImage(req, id, imageId) {
        return this.staysService.setPrimaryImage(req.user.sub, id, imageId);
    }
    async removeImage(req, id, imageId) {
        return this.staysService.removeImage(req.user.sub, id, imageId);
    }
};
exports.StaysController = StaysController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new stay listing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Stay created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_stay_dto_1.CreateStayDto, Array]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all stays with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of stays' }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search stays by location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns search results' }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('my-stays'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get stays owned by the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user\'s stays' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "findUserStays", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stay by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the stay' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stay not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a stay' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stay updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stay not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_stay_dto_1.UpdateStayDto]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a stay' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stay deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stay not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add images to a stay' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Images added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stay not found' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "addImages", null);
__decorate([
    (0, common_1.Put)(':id/images/:imageId/primary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Set primary image for a stay' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Primary image set successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stay or image not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "setPrimaryImage", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an image from a stay' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not the owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stay or image not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], StaysController.prototype, "removeImage", null);
exports.StaysController = StaysController = __decorate([
    (0, swagger_1.ApiTags)('stays'),
    (0, common_1.Controller)('stays'),
    __metadata("design:paramtypes", [stays_service_1.StaysService])
], StaysController);
//# sourceMappingURL=stays.controller.js.map