import { Module } from '@nestjs/common';
import { ProviderPortfolioController } from './provider-portfolio.controller';
import { ProviderPortfolioService } from './provider-portfolio.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, AuthModule, StorageModule],
  controllers: [ProviderPortfolioController],
  providers: [ProviderPortfolioService],
})
export class ProviderPortfolioModule {}