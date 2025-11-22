import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { AdminCreateUserDto } from '../users/dto/admin-create-user.dto';
import { Role } from './enums/role.enum';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(dto: {
        name: string;
        username: string;
        email: string;
        phone: string;
        password: string;
        role: Role;
    }): Promise<{
        user: {
            name: string | null;
            email: string;
            phone: string;
            role: string;
            id: string;
            username: string | null;
            createdAt: Date;
            updatedAt: Date;
            walletBalance: import("@prisma/client/runtime/library").Decimal;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        };
        access_token: string;
        refresh_token: string;
    }>;
    validateUser(email: string, pass: string): Promise<any>;
    login(dto: LoginUserDto): Promise<{
        user: any;
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getProfileByEmail(email: string): Promise<{
        name: string | null;
        email: string;
        phone: string;
        role: string;
        id: string;
        username: string | null;
        createdAt: Date;
        updatedAt: Date;
        walletBalance: import("@prisma/client/runtime/library").Decimal;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
    }>;
    adminCreateUser(dto: AdminCreateUserDto): Promise<{
        name: string | null;
        email: string;
        phone: string;
        role: string;
        id: string;
        username: string | null;
        createdAt: Date;
        updatedAt: Date;
        walletBalance: import("@prisma/client/runtime/library").Decimal;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
    }>;
}
