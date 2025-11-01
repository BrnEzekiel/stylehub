import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string;
        role: string;
        createdAt: Date;
    }[]>;
}
