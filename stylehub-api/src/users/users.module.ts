// src/users/users.module.ts

import { Module, forwardRef } from '@nestjs/common'; // 1. 🛑 Import forwardRef
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module'; // 2. 🛑 Import AuthModule

@Module({
  imports: [
    PrismaModule,
    // 3. 🛑 Use forwardRef to break the circular dependency
    forwardRef(() => AuthModule), 
  ],
  providers: [UsersService],
  exports: [UsersService], // This must be here for AuthModule
  controllers: [UsersController],
})
export class UsersModule {}