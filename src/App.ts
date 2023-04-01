import { config as AWSConfig } from 'aws-sdk';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import config from './config/configuration-expert';

export class App {
  private server: INestApplication;

  constructor(server: INestApplication) {
    this.server = server;
  }

  public static async initialize(): Promise<App> {
    const server = await NestFactory.create(AppModule);
    server.enableCors({ origin: '*' });
    server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: false,
      })
    );
    server.useGlobalInterceptors(new ClassSerializerInterceptor(server.get(Reflector), { excludePrefixes: ['__'] }));
    server.useLogger(config.get('app.logs.level'));
    AWSConfig.update(config.get('aws'));

    this.addOpenApiSpecification(server);

    return new App(server);
  }

  private static addOpenApiSpecification(server: INestApplication): void {
    const apiConfig = new DocumentBuilder()
      .setTitle('Beta Auction')
      .setDescription('The auction API specefications')
      .setVersion('0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(server, apiConfig);
    SwaggerModule.setup('api', server, document);
  }

  public start(): void {
    this.server.listen(config.get('app.port'));
  }
}
