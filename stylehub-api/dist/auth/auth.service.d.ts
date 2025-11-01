import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterUserDto): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
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
        id: string;
        email: string;
        phone: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
