import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller'; // Import the new controller

@Module({
  providers: [NotificationsService],
  controllers: [NotificationsController], // Add the controller here
})
export class NotificationsModule {}
