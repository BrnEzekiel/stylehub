// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

// 1. IMPORT the multipart parser
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // 2. 🛑 THE FIX 🛑
  // Define the list of allowed origins
  const corsOrigins = [
    'http://localhost:3000', // Your stylehub-client app
    'http://localhost:3002', // Your new stylehub-admin app
  ];

  // 3. Enable CORS by passing the array directly
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 4. Global pipes (using your original settings + transform for DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. REGISTER the multipart parser
  app.register(fastifyMultipart); 

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 StyleHub API running on: http://localhost:${port}`);
}
bootstrap();