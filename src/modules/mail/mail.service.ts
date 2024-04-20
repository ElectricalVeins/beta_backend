import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nm from 'nodemailer';

import config from '../../config/configuration-expert';
import { User } from '../application/user/user.entity';

@Injectable()
export class MailService implements OnModuleInit {
  private logger = new Logger(MailService.name)
  private transport: nm.Transporter;

  constructor() { }

  async onModuleInit(): Promise<void> {
    const { user, pass } = await nm.createTestAccount();
    this.logger.log(`Created account for Emailing: ${user}:${pass}`);
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

  async sendConfirmationEmail(user: User, confirmationToken: string): Promise<void> {
    // TODO: extract html generation to template engine
    const message = {
      from: 'beta-server',
      to: user.email,
      subject: "Welcome to Billy's server",
      html: `<h1>To confirm your account, please use this key: ${confirmationToken}</h1>`,
    };

    try {
      const res = await this.sendEmail(message);
      this.logger.log(`${Date.now()}|MailService:`, nm.getTestMessageUrl(res))
    } catch (err) {
      this.logger.error(err.message, 'MailService')
    }
  }

  private async sendEmail(message: nm.SendMailOptions): Promise<nm.SentMessageInfo> {
    try {
      return this.transport.sendMail(message);
    } catch (err) {
      this.logger.warn(err);
    }
  }
}
