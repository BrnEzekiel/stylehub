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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../auth/enums/role.enum");
let ChatGateway = class ChatGateway {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.logger = new common_1.Logger('ChatGateway');
        this.userSocketMap = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token)
                throw new Error('No token provided');
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            const userId = payload.sub;
            const userRole = payload.role;
            this.userSocketMap.set(userId, client);
            client['user'] = { userId, role: userRole };
            this.logger.log(`Client connected: ${userId} (Role: ${userRole})`);
            if (userRole === role_enum_1.Role.Client) {
                this.emitStatusToSellers(userId, true);
            }
            if (userRole === role_enum_1.Role.Seller) {
                this.emitStatusToClients(userId, true);
            }
        }
        catch (error) {
            this.logger.error(`Connection failed: ${error.message}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const user = client['user'];
        if (user) {
            this.userSocketMap.delete(user.userId);
            this.logger.log(`Client disconnected: ${user.userId}`);
            if (user.role === role_enum_1.Role.Client) {
                this.emitStatusToSellers(user.userId, false);
            }
            if (user.role === role_enum_1.Role.Seller) {
                this.emitStatusToClients(user.userId, false);
            }
        }
    }
    handleMessage(client, payload) {
        const fromUser = client['user'];
        if (!fromUser)
            return;
        const recipientSocket = this.userSocketMap.get(payload.toUserId);
        const message = {
            from: fromUser.userId,
            to: payload.toUserId,
            content: payload.content,
            timestamp: new Date(),
        };
        if (recipientSocket) {
            recipientSocket.emit('receiveMessage', message);
        }
        client.emit('messageSent', message);
        this.logger.log(`Message from ${fromUser.userId} to ${payload.toUserId}`);
    }
    emitStatusToSellers(clientId, isOnline) {
        this.userSocketMap.forEach((socket) => {
            if (socket['user']?.role === role_enum_1.Role.Seller) {
                socket.emit('clientStatus', { clientId, isOnline });
            }
        });
    }
    emitStatusToClients(sellerId, isOnline) {
        this.userSocketMap.forEach((socket) => {
            if (socket['user']?.role === role_enum_1.Role.Client) {
                socket.emit('sellerStatus', { sellerId, isOnline });
            }
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map