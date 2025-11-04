// src/chat/chat.gateway.ts

import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';

@WebSocketGateway({
  cors: {
    // Allow your client app
    origin: 'http://localhost:3000', 
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  // Stores { "userId" -> socket }
  private userSocketMap = new Map<string, Socket>();

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Handle a new user connecting
   */
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('No token provided');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload.sub;
      const userRole = payload.role;

      // Store this user's socket
      this.userSocketMap.set(userId, client);

      // Attach user info to the socket
      client['user'] = { userId, role: userRole };

      this.logger.log(`Client connected: ${userId} (Role: ${userRole})`);

      // Notify sellers that this client is online
      if (userRole === Role.Client) {
        this.emitStatusToSellers(userId, true);
      }
      
      // Notify clients that this seller is online
      if (userRole === Role.Seller) {
        this.emitStatusToClients(userId, true);
      }

    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.disconnect(true);
    }
  }

  /**
   * Handle a user disconnecting
   */
  handleDisconnect(client: Socket) {
    const user = client['user'];
    if (user) {
      this.userSocketMap.delete(user.userId);
      this.logger.log(`Client disconnected: ${user.userId}`);
      
      if (user.role === Role.Client) {
        this.emitStatusToSellers(user.userId, false);
      }
      if (user.role === Role.Seller) {
        this.emitStatusToClients(user.userId, false);
      }
    }
  }

  /**
   * Handle an incoming message
   */
  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { toUserId: string; content: string },
  ): void {
    const fromUser = client['user'];
    if (!fromUser) return;

    const recipientSocket = this.userSocketMap.get(payload.toUserId);

    const message = {
      from: fromUser.userId,
      to: payload.toUserId,
      content: payload.content,
      timestamp: new Date(),
    };

    if (recipientSocket) {
      // Send the message to the recipient
      recipientSocket.emit('receiveMessage', message);
    }
    
    // Send confirmation back to the sender
    client.emit('messageSent', message);
    this.logger.log(`Message from ${fromUser.userId} to ${payload.toUserId}`);
  }

  // Helper to notify all online sellers
  private emitStatusToSellers(clientId: string, isOnline: boolean) {
    this.userSocketMap.forEach((socket) => {
      if (socket['user']?.role === Role.Seller) {
        socket.emit('clientStatus', { clientId, isOnline });
      }
    });
  }
  
  // Helper to notify all online clients
  private emitStatusToClients(sellerId: string, isOnline: boolean) {
    this.userSocketMap.forEach((socket) => {
      if (socket['user']?.role === Role.Client) {
        socket.emit('sellerStatus', { sellerId, isOnline });
      }
    });
  }
}