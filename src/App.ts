import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { config } from './config/configuration-expert';

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
    return new App(server);
  }

  public start(): void {
    this.server.listen(config.get('app.port'));
  }
}
