import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow frontend (Angular at :4200) to communicate with the API
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // Add a global prefix so all routes are under /api
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Use environment PORT if set, otherwise default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // Log where the server is running
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

// Start the application
bootstrap();
