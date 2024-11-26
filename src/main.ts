import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CatchExceptionFilter } from './shared/filters/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Enable Exceptions
  app.useGlobalFilters(new CatchExceptionFilter());
  app.useStaticAssets(join(__dirname, './proxess.templates'));

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
