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
exports.StyleDIYController = void 0;
const common_1 = require("@nestjs/common");
const fastify_multer_1 = require("@nest-lab/fastify-multer");
const style_diy_service_1 = require("./style-diy.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_post_dto_1 = require("./dto/create-post.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const create_recommendation_dto_1 = require("./dto/create-recommendation.dto");
let StyleDIYController = class StyleDIYController {
    constructor(styleDIYService) {
        this.styleDIYService = styleDIYService;
    }
    createPost(req, dto, files) {
        const imageFile = files?.image?.[0];
        const videoFile = files?.video?.[0];
        return this.styleDIYService.createPost(req.user.sub, dto, imageFile, videoFile);
    }
    getAllPosts(page, limit) {
        return this.styleDIYService.getAllPosts(page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    getPostById(id) {
        return this.styleDIYService.getPostById(id);
    }
    likePost(id) {
        return this.styleDIYService.likePost(id);
    }
    addComment(req, id, dto) {
        return this.styleDIYService.addComment(id, req.user.sub, dto);
    }
    addRecommendation(req, id, dto) {
        return this.styleDIYService.addRecommendation(id, req.user.sub, dto);
    }
    deletePost(req, id) {
        return this.styleDIYService.deletePost(id, req.user.sub);
    }
};
exports.StyleDIYController = StyleDIYController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, fastify_multer_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", void 0)
], StyleDIYController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StyleDIYController.prototype, "getAllPosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StyleDIYController.prototype, "getPostById", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StyleDIYController.prototype, "likePost", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], StyleDIYController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)(':id/recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_recommendation_dto_1.CreateRecommendationDto]),
    __metadata("design:returntype", void 0)
], StyleDIYController.prototype, "addRecommendation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StyleDIYController.prototype, "deletePost", null);
exports.StyleDIYController = StyleDIYController = __decorate([
    (0, common_1.Controller)('api/style-diy'),
    __metadata("design:paramtypes", [style_diy_service_1.StyleDIYService])
], StyleDIYController);
//# sourceMappingURL=style-diy.controller.js.map