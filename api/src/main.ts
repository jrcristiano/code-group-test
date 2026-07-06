import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new Logger('Bootstrap');
  app.useLogger(app.get(PinoLogger));

  const configService = app.get(ConfigService);

  // --- Security Headers (Helmet) ---
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy:
        configService.get<string>('NODE_ENV') === 'production'
          ? undefined
          : false,
    }),
  );

  // --- CORS Restrito ---
  const corsOrigins = configService.get<string>(
    'CORS_ORIGINS',
    'http://localhost:5173',
  );
  const allowedOrigins = corsOrigins.split(',').map((s) => s.trim());

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: true,
  });

  // --- Payload Size Limit ---
  const maxPayload = configService.get<string>('MAX_PAYLOAD_SIZE', '1mb');
  app.use(json({ limit: maxPayload }));

  // --- Validation Pipe (já existente, mantido) ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // --- Swagger Condicional ---
  const swaggerEnabled =
    configService.get<string>('SWAGGER_ENABLED', 'false') === 'true';

  if (swaggerEnabled) {
    // Resolve API calls relative to the URL that served the OpenAPI document.
    // This yields /projects on direct access (/docs-json) and /api/projects
    // when Swagger is accessed through the frontend proxy (/api/docs-json).
    const swaggerServer = configService.get<string>('SWAGGER_SERVER', '.');

    const builder = new DocumentBuilder()
      .setTitle('Project Manager API')
      .setDescription('API de gerenciamento simplificado de projetos')
      .setVersion('1.0');

    if (swaggerServer) {
      builder.addServer(swaggerServer);
    }

    const config = builder.build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  // --- Graceful Shutdown ---
  app.enableShutdownHooks();

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  logger.log(`API running on http://localhost:${port}`);
  if (swaggerEnabled) {
    logger.log(`Swagger available at http://localhost:${port}/docs`);
  }
}

bootstrap();
