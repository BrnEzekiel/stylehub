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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            return user;
        }
        catch (error) {
            console.error(`[UsersService] Error finding user by email ${email}:`, error);
            throw new common_1.InternalServerErrorException('Database error while finding user by email.');
        }
    }
    async findByPhone(phone) {
        try {
            const user = await this.prisma.user.findUnique({ where: { phone } });
            return user;
        }
        catch (error) {
            console.error(`[UsersService] Error finding user by phone ${phone}:`, error);
            throw new common_1.InternalServerErrorException('Database error while finding user by phone.');
        }
    }
    async create(data) {
        try {
            const user = await this.prisma.user.create({ data });
            return user;
        }
        catch (error) {
            console.error('[UsersService] Error creating user:', data.email, error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.ConflictException('Email or phone number already exists.');
            }
            throw new common_1.InternalServerErrorException('Database error while creating user.');
        }
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                phone: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findPublicById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findFullUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                phone: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { orders: true, products: true, reviews: true },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async adminUpdateUser(id, data) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: data,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    username: true,
                    phone: true,
                    role: true,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.ConflictException('Email or phone number is already in use.');
            }
            console.error('Admin update user error:', error);
            throw new common_1.InternalServerErrorException('Could not update user.');
        }
    }
    async adminDeleteUser(id) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            await this.prisma.user.delete({ where: { id: id } });
            return { message: 'User and all related data deleted successfully.' };
        }
        catch (error) {
            console.error('Admin delete user error:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                throw new common_1.InternalServerErrorException('Database error: Could not delete user due to a foreign key constraint. Please check schema relations.');
            }
            throw new common_1.InternalServerErrorException('Could not delete user.');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map