import { UsersService } from './users.service';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AuthService } from '../auth/auth.service';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    getAllUsers(): Promise<{
        name: string;
        email: string;
        phone: string;
        role: string;
        id: string;
        username: string;
        createdAt: Date;
    }[]>;
    getUserById(id: string): Promise<{
        name: string;
        role: string;
        id: string;
        username: string;
    }>;
    createUser(adminCreateUserDto: AdminCreateUserDto): Promise<{
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
    getFullUserDetails(id: string): Promise<{
        name: string;
        email: string;
        phone: string;
        role: string;
        id: string;
        username: string;
        createdAt: Date;
        _count: {
            orders: number;
            products: number;
            reviews: number;
        };
    }>;
    updateUser(id: string, adminUpdateUserDto: AdminUpdateUserDto): Promise<{
        name: string;
        email: string;
        phone: string;
        role: string;
        id: string;
        username: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
