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
import { StatsModule } from './stats/stats.module';
import { ChatModule } from './chat/chat.module';
import { PayoutsModule } from './payouts/payouts.module';
import { VerificationModule } from './verification/verification.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { WalletModule } from './wallet/wallet.module'; // 1. 🛑 Import

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    StatsModule,
    ChatModule,
    PayoutsModule,
    VerificationModule,
    WishlistModule,
    WalletModule, // 2. 🛑 Add
  ],
  providers: [],
})
export class AppModule {}