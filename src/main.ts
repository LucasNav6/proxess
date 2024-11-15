import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Exceptions } from './proxess.domain/Exceptions/Exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Enable Exceptions
  app.useGlobalFilters(new Exceptions());

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
