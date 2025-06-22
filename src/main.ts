// src/main.ts

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const redis = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'redis',
        port: 6379,
      },
    },
  );

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Auth template')
    .setDescription('Auth template documentation')
    .setVersion('1.0')
    .addBearerAuth() // Adds the Bearer token option
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  try {
    await redis.listen();
    console.log('✅ Microservice connected and listening to Redis');
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
