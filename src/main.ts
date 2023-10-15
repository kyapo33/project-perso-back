import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mon API')
    .setDescription('La description de mon API')
    .setVersion('1.0')
    .addTag('monapi')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT ?? '8080'));
}
bootstrap();