// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { StorageModule } from './storage/storage.module';
import { KycModule } from './kyc/kyc.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
// 🛑 REMOVED: import { MulterModule } from '@nest-lab/fastify-multer'; 

@Module({
  imports: [
    // Load .env file globally
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 🛑 REMOVED: MulterModule.register(...)

    PrismaModule,
    AuthModule,
    UsersModule,
    StorageModule,
    KycModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentModule,
    ReviewsModule,
    SearchModule,
    EventEmitterModule.forRoot(),
    NotificationsModule,
  ],
  providers: [],
})
export class AppModule {}