import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

export const createHandler = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
    app.enableCors({
      origin: ['http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
