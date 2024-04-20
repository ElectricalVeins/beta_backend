import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { TokenPairWithSession, TokenService } from '../jwt-token/jwt-token.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload, JwtTokenTypes, UserAuth } from '../../types';
import { UserService } from '../application/user/user.service';
import { CreateUserDto } from '../application/user/dto/create-user.dto';
import { LoginUserDto } from '../application/user/dto/login-user.dto';
import { User } from '../application/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) { }

  public async signUp(dto: CreateUserDto, userAgent: string): Promise<UserAuth> {
    const user = await this.userService.create(dto);
    const { id: tier } = await user.tier;
    const { access, refresh, id } = await this.tokenService.signTokens(
      {
        userid: user.id,
        role: user.role['id'],
        tier: tier.toString(),
      },
      userAgent
    );
    const confirmationToken = await this.tokenService.createConfirmEmailToken(
      user,
    )
    try {
      this.mailService.sendConfirmationEmail(user, confirmationToken);
    } catch (e) {
      Logger.error(e);
    }
    return {
      user,
      session: { access, refresh, id },
    };
  }

  public async signIn(dto: LoginUserDto, userAgent: string): Promise<UserAuth> {
    const user = await this.userService.findOneByLoginOrEmail(dto.login);
    if (!user) {
      throw new UnauthorizedException('Incorrect login or password');
    }
    const { id: tier } = await user.tier;
    const isCorrectPassword = await this.userService.checkPassword(user, dto.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect login or password');
    }
    const { access, refresh, id } = await this.tokenService.signTokens(
      {
        userid: user.id,
        role: user.role['id'],
        tier: tier.toString(),
      },
      userAgent
    );

    return {
      user,
      session: { access, refresh, id },
    };
  }

  public async activateUser(token: string): Promise<Partial<User>> {
    const { userid, tier }: Partial<JwtPayload> = await this.tokenService.verifyConfirmEmailToken(token);
    return await this.userService.activateUser(userid as string, tier);
  }

  public async refreshSession(refreshToken: string, userAgent: string): Promise<UserAuth> {
    const { id, tier } = await this.tokenService.verifyToken(refreshToken, JwtTokenTypes.REFRESH);
    const user = await this.userService.findOneById(id, tier);
    if (!user) {
      throw new NotFoundException();
    }
    const { access, refresh } = await this.tokenService.signTokens(
      {
        userid: user.id,
        role: user.role['id'],
        tier: tier.toString(),
      },
      userAgent
    );

    return {
      user,
      session: { access, refresh, id },
    };
  }

  public async getExistingSessions(userId: number): Promise<TokenPairWithSession[]> {
    return this.tokenService.getExistingSessions(userId);
  }

  public async signOut(userid: number, sessionId: string): Promise<void> {
    await this.tokenService.banSession(userid, sessionId);
  }
}
