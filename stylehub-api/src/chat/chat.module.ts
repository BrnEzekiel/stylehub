// src/chat/chat.module.ts

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    AuthModule, // Imports AuthModule to get JwtService
    PrismaModule,
  ],
  providers: [ChatGateway],
})
export class ChatModule {}