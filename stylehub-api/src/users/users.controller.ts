// src/users/users.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @route   GET /api/users
   * @desc    Get all users in the system
   * @access  Private (Admin)
   */
  @Get()
  @Roles(Role.Admin)
  async getAllUsers() {
    return this.usersService.findAll();
  }
}