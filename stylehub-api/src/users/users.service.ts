// src/users/users.service.ts
import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client'; 
import { Role } from '../auth/enums/role.enum'; 
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      return user;
    } catch (error) {
      console.error(`[UsersService] Error finding user by email ${email}:`, error);
      throw new InternalServerErrorException('Database error while finding user by email.');
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { phone } });
      return user;
    } catch (error) {
       console.error(`[UsersService] Error finding user by phone ${phone}:`, error);
       throw new InternalServerErrorException('Database error while finding user by phone.');
    }
  }

  async create(data: {
    name: string;
    email: string;
    phone: string;
    password_hash: string;
    role: Role; 
  }): Promise<User> {
     try {
        const user = await this.prisma.user.create({ data });
        return user;
     } catch (error) {
        console.error('[UsersService] Error creating user:', data.email, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictException('Email or phone number already exists.');
        }
        throw new InternalServerErrorException('Database error while creating user.');
     }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async findPublicById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findFullUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true, products: true, reviews: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async adminUpdateUser(id: string, data: AdminUpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: data,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email or phone number is already in use.');
      }
      console.error('Admin update user error:', error);
      throw new InternalServerErrorException('Could not update user.');
    }
  }

  /**
   * 🛑 SIMPLIFIED: Admin: Delete any user.
   * The database will now cascade all deletes automatically based on the schema.
   */
  async adminDeleteUser(id: string) {
    try {
      // Check if user exists first
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      // 🛑 This is now the only line needed.
      // The `onDelete` rules in the schema will handle all related data.
      await this.prisma.user.delete({ where: { id: id } });

      return { message: 'User and all related data deleted successfully.' };
    } catch (error) {
      console.error('Admin delete user error:', error);
      // Catch foreign key constraint errors if any rules were missed
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
         throw new InternalServerErrorException('Database error: Could not delete user due to a foreign key constraint. Please check schema relations.');
      }
      throw new InternalServerErrorException('Could not delete user.');
    }
  }
}