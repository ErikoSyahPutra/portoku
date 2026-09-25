import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express = require('express');

const server = express();

export const createHandler = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.init();
  return server;
};

// Export handler for Vercel (CommonJS-compatible)
let cachedServer: any;
const handler = async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = await createHandler();
  }
  return cachedServer(req, res);
};

module.exports = handler;

// For local running / Render / persistent servers
if (!process.env.VERCEL) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allowedOrigins = [
      'http://localhost:3000',
      'https://erikosyah.my.id',
      'https://www.erikosyah.my.id',
      ...(process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
        : []),
    ].filter(Boolean);

    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on port ${port}`);
  }
  bootstrap();
}
