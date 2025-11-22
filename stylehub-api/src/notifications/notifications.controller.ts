// stylehub-api/src/notifications/notifications.controller.ts
import { Controller, Get, Patch, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming JWT for authentication

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Req() req) {
    return this.notificationsService.findAllForUser(req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    return this.notificationsService.getUnreadCountForUser(req.user.id);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(@Req() req, @Param('id') id: string) {
    await this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('mark-all-read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Req() req) {
    await this.notificationsService.markAllAsReadForUser(req.user.id);
  }
}
