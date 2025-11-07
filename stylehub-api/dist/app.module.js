"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const storage_module_1 = require("./storage/storage.module");
const kyc_module_1 = require("./kyc/kyc.module");
const products_module_1 = require("./products/products.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const payment_module_1 = require("./payment/payment.module");
const reviews_module_1 = require("./reviews/reviews.module");
const search_module_1 = require("./search/search.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const notifications_module_1 = require("./notifications/notifications.module");
const stats_module_1 = require("./stats/stats.module");
const chat_module_1 = require("./chat/chat.module");
const payouts_module_1 = require("./payouts/payouts.module");
const verification_module_1 = require("./verification/verification.module");
const wishlist_module_1 = require("./wishlist/wishlist.module");
const wallet_module_1 = require("./wallet/wallet.module");
const provider_portfolio_module_1 = require("./provider-portfolio/provider-portfolio.module");
const services_module_1 = require("./services/services.module");
const bookings_module_1 = require("./bookings/bookings.module");
const withdrawal_admin_module_1 = require("./withdrawal-admin/withdrawal-admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            storage_module_1.StorageModule,
            kyc_module_1.KycModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            payment_module_1.PaymentModule,
            reviews_module_1.ReviewsModule,
            search_module_1.SearchModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            notifications_module_1.NotificationsModule,
            stats_module_1.StatsModule,
            chat_module_1.ChatModule,
            payouts_module_1.PayoutsModule,
            verification_module_1.VerificationModule,
            wishlist_module_1.WishlistModule,
            wallet_module_1.WalletModule,
            provider_portfolio_module_1.ProviderPortfolioModule,
            services_module_1.ServicesModule,
            bookings_module_1.BookingsModule,
            withdrawal_admin_module_1.WithdrawalAdminModule,
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map