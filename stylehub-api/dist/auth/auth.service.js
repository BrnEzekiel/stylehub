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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existingEmail = await this.usersService.findByEmail(dto.email);
        if (existingEmail) {
            throw new common_1.ConflictException('Email already in use');
        }
        const existingPhone = await this.usersService.findByPhone(dto.phone);
        if (existingPhone) {
            throw new common_1.ConflictException('Phone number already in use');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        try {
            const user = await this.usersService.create({
                name: dto.name,
                username: dto.username,
                email: dto.email,
                phone: dto.phone,
                password_hash: hashedPassword,
                role: dto.role,
            });
            const payload = { sub: user.id, email: user.email, role: user.role, username: user.username };
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(payload, {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: '1d',
                }),
                this.jwtService.signAsync(payload, {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                }),
            ]);
            const { password_hash, ...userResult } = user;
            return {
                user: userResult,
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Email or phone already exists');
            }
            console.error('Error during user registration:', error);
            throw new common_1.InternalServerErrorException('Could not create user');
        }
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        this.logger.log(`Validating user: ${email}. User object received: ${JSON.stringify(user)}`);
        if (user && user.password_hash && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        this.logger.warn(`Validation failed for: ${email}. 'user.password_hash' was falsy or compare failed.`);
        return null;
    }
    async login(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.id || !user.email || !user.role) {
            console.error('User object missing expected properties after validation:', user);
            throw new common_1.InternalServerErrorException('User data incomplete after validation.');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '1d',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        return {
            user,
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            if (!payload || !payload.email) {
                throw new common_1.UnauthorizedException('Invalid refresh token payload content');
            }
            const user = await this.usersService.findByEmail(payload.email);
            if (!user) {
                throw new common_1.UnauthorizedException('User associated with refresh token not found');
            }
            if (!user.id || !user.email || !user.role) {
                console.error('User object missing expected properties during refresh:', user);
                throw new common_1.InternalServerErrorException('User data incomplete during refresh.');
            }
            const newPayload = { sub: user.id, email: user.email, role: user.role };
            const accessToken = await this.jwtService.signAsync(newPayload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '1d',
            });
            return {
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        }
        catch (e) {
            console.error("Refresh token error:", e.message);
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async getProfileByEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password_hash, ...profile } = user;
        return profile;
    }
    async adminCreateUser(dto) {
        const existingEmail = await this.usersService.findByEmail(dto.email);
        if (existingEmail) {
            throw new common_1.ConflictException('Email already in use');
        }
        const existingPhone = await this.usersService.findByPhone(dto.phone);
        if (existingPhone) {
            throw new common_1.ConflictException('Phone number already in use');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        try {
            const user = await this.usersService.create({
                name: dto.name,
                email: dto.email,
                username: dto.email.split('@')[0],
                phone: dto.phone,
                password_hash: hashedPassword,
                role: dto.role,
            });
            const { password_hash, ...userResult } = user;
            return userResult;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Email or phone already exists');
            }
            console.error('Error during admin user creation:', error);
            throw new common_1.InternalServerErrorException('Could not create user');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map