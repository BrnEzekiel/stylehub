import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { Role } from '../auth/enums/role.enum';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    create(data: {
        name: string;
        email: string;
        phone: string;
        password_hash: string;
        role: Role;
    }): Promise<User>;
    findAll(): Promise<{
        name: string;
        email: string;
        phone: string;
        role: string;
        id: string;
        createdAt: Date;
    }[]>;
    findPublicById(id: string): Promise<{
        name: string;
        role: string;
        id: string;
    }>;
    findFullUserById(id: string): Promise<{
        name: string;
        email: string;
        phone: string;
        role: string;
        id: string;
        createdAt: Date;
        _count: {
            orders: number;
            products: number;
            reviews: number;
        };
    }>;
    adminUpdateUser(id: string, data: AdminUpdateUserDto): Promise<{
        name: string;
        email: string;
        phone: string;
        role: string;
        id: string;
    }>;
    adminDeleteUser(id: string): Promise<{
        message: string;
    }>;
}
