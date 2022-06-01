import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

export class App {
  private server: INestApplication;
  private config: ConfigService;

  constructor(server: INestApplication) {
    this.server = server;
    this.config = server.get(ConfigService);
  }

  public static async initialize(): Promise<App> {
    const server = await NestFactory.create(AppModule);
    const configService = server.get(ConfigService);
    server.enableCors({ origin: '*' });
    server.useLogger(configService.get('logLevel'));
    return new App(server);
  }

  public start(): void {
    this.server.listen(this.config.get('port'));
  }
}
