import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { Role } from '../auth/enums/role.enum';
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
        id: string;
        email: string;
        phone: string;
        role: string;
        createdAt: Date;
    }[]>;
}
