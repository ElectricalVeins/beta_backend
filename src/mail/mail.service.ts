import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nm from 'nodemailer';
import { config } from '../config/configuration-expert';
import { User } from '../user/user.entity';
import { TokenService } from '../jwt-token/jwt-token.service';

@Injectable()
export class MailService implements OnModuleInit {
  private transport: nm.Transporter;

  constructor(private tokenService: TokenService) {}

  async onModuleInit(): Promise<void> {
    const { user, pass } = await nm.createTestAccount('beta-server');
    this.transport = nm.createTransport({
      host: config.get('app.email.host'),
      port: config.get('app.email.port'),
      secure: config.get('app.email.secure'),
      auth: {
        user,
        pass,
      },
    });
  }

  async sendConfirmationEmail(user: User): Promise<void> {
    const message = {
      from: 'beta-server',
      to: user.email,
      subject: "Welcome to Billy's server",
      html: `<h1>To confirm your account, please use this key: ${await this.tokenService.createConfirmEmailToken(
        user
      )}</h1>`,
    };
    const res = await this.sendEmail(message);
    Logger.log(nm.getTestMessageUrl(res));
  }

  private async sendEmail(message): Promise<any> {
    try {
      return await this.transport.sendMail(message);
    } catch (err) {
      Logger.warn(err);
    }
  }
}
