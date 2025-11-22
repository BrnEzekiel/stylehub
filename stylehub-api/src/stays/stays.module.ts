import { Module } from '@nestjs/common';
import { StaysController } from './stays.controller';
import { StaysService } from './stays.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadDir = join(process.cwd(), 'uploads', 'stays');
            require('fs').mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
          },
          filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            cb(null, `${uuidv4()}.${ext}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed!'), false);
          }
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StaysController],
  providers: [StaysService],
  exports: [StaysService],
})
export class StaysModule {}
