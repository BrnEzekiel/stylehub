import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterUserDto): Promise<{
        user: {
            name: string | null;
            email: string;
            phone: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
        refresh_token: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        user: any;
        access_token: string;
        refresh_token: string;
    }>;
    refreshPlaceholder(refreshToken?: string): Promise<{
        access_token: string;
        refresh_token: string;
    } | {
        message: string;
    }>;
    getProfile(req: any): Promise<{
        name: string | null;
        email: string;
        phone: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
