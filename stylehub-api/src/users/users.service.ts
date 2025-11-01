// src/users/users.service.ts
import { Injectable, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client'; // 1. 🛑 Removed 'Role' from this import
import { Role } from '../auth/enums/role.enum'; // 2. 🛑 Added this import for your local enum

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Cleaned findByEmail with basic error handling
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error(`[UsersService] Error finding user by email ${email}:`, error);
      throw new InternalServerErrorException('Database error while finding user by email.');
    }
  }

  // Cleaned findByPhone with basic error handling
  async findByPhone(phone: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phone },
      });
      return user;
    } catch (error) {
       console.error(`[UsersService] Error finding user by phone ${phone}:`, error);
       throw new InternalServerErrorException('Database error while finding user by phone.');
    }
  }

  // Cleaned create with basic error handling
  async create(data: {
    name: string;
    email: string;
    phone: string;
    password_hash: string;
    role: Role; // 3. 🛑 This 'Role' type now correctly refers to your local enum
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

  /**
   * 🛑 NEW METHOD FOR ADMIN DASHBOARD 🛑
   * Finds all users and selects only safe fields to return.
   */
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
}