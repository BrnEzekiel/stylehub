// src/users/users.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  Body,
  Post, // 1. 🛑 Import Post
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto'; // 2. 🛑 Import new DTO
import { AuthService } from '../auth/auth.service'; // 3. 🛑 Import AuthService

@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService, // 4. 🛑 Inject AuthService
  ) {}

  /**
   * @route   GET /api/users
   * @desc    Get all users (Admin)
   */
  @Get()
  @Roles(Role.Admin)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  /**
   * @route   GET /api/users/:id
   * @desc    Get public info (for chat)
   * @access  Private (Client, Seller)
   */
  @Get(':id')
  @Roles(Role.Client, Role.Seller)
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findPublicById(id);
  }

  // --- 🛑 ADMIN CRUD ROUTES 🛑 ---

  /**
   * 5. 🛑 NEW: Admin create user route
   * @route   POST /api/users/admin/create
   * @desc    Create a new user (Admin)
   */
  @Post('admin/create')
  @Roles(Role.Admin)
  async createUser(@Body() adminCreateUserDto: AdminCreateUserDto) {
    // We use AuthService to handle hashing and creation
    return this.authService.adminCreateUser(adminCreateUserDto);
  }

  /**
   * @route   GET /api/users/admin/:id
   * @desc    Get full user details for editing (Admin)
   */
  @Get('admin/:id')
  @Roles(Role.Admin)
  async getFullUserDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findFullUserById(id);
  }

  /**
   * @route   PATCH /api/users/admin/:id
   * @desc    Update a user's details (Admin)
   */
  @Patch('admin/:id')
  @Roles(Role.Admin)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(id, adminUpdateUserDto);
  }

  /**
   * @route   DELETE /api/users/admin/:id
   * @desc    Delete a user (Admin)
   */
  @Delete('admin/:id')
  @Roles(Role.Admin)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.adminDeleteUser(id);
  }
}