// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller'; // 1. Import the new controller

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService], // This must be here for AuthModule
  controllers: [UsersController], // 2. Add the controller
})
export class UsersModule {}