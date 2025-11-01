import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';

@Global() // Make StorageService available everywhere
@Module({
  imports: [ConfigModule], // Needs ConfigService to read .env keys
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}