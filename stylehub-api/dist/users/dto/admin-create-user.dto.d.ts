import { Role } from '../../auth/enums/role.enum';
export declare class AdminCreateUserDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
}
