import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TokenService } from '../jwt-token/jwt-token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../token-refresh/token-refresh.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload, JwtTokenTypes, UserAuth } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly mailService: MailService
  ) {}

  public async signUp(dto: CreateUserDto): Promise<UserAuth> {
    const user = await this.userService.create(dto);
    const { id: tier } = await user.tier;
    const [[access, refresh], setTokenCache] = await this.tokenService.signTokens({
      userid: user.id,
      role: user.role['id'],
      tier: tier.toString(),
    });
    await this.refreshTokenService.createRecord(refresh, user.id, false);
    try {
      this.mailService.sendConfirmationEmail(user);
    } catch (e) {
      Logger.error(e);
    }
    setTokenCache();
    return {
      user,
      tokens: { access, refresh },
    };
  }

  public async signIn(dto): Promise<UserAuth> {
    const user = await this.userService.findOneByLoginOrEmail(dto.login);
    if (!user) {
      throw new UnauthorizedException('Incorrect login or password');
    }
    const { id: tier } = await user.tier;
    const isCorrectPassword = await this.userService.checkPassword(user, dto.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect login or password');
    }
    const [[access, refresh], setTokenCache] = await this.tokenService.signTokens({
      userid: user.id,
      role: user.role['id'],
      tier: tier.toString(),
    });
    await this.refreshTokenService.createRecord(refresh, user.id);
    setTokenCache();
    return {
      user,
      tokens: { access, refresh },
    };
  }

  public async activateUser(token: string): Promise<any> {
    const { userid, tier }: Partial<JwtPayload> = await this.tokenService.verifyConfirmEmailToken(token);
    return await this.userService.activateUser(userid, tier);
  }

  public async refreshSession(refreshToken: string): Promise<UserAuth> {
    const { id, tier } = await this.tokenService.verifyToken(refreshToken, JwtTokenTypes.REFRESH);
    const user = await this.userService.findOneById(id, tier);
    if (!user) {
      throw new NotFoundException();
    }
    const [[access, refresh], setTokenCache] = await this.tokenService.signTokens({
      userid: user.id,
      role: user.role['id'],
      tier: tier.toString(),
    });
    const existingRefreshToken = await this.refreshTokenService.getTokenRecordByValue(refreshToken, user.id);
    /*TODO: use of transactionalEntityManager IS REQUIRED */
    await this.dataSource.transaction(async () =>
      Promise.all([
        this.refreshTokenService.deleteRecord(existingRefreshToken),
        this.refreshTokenService.createRecord(refresh, user.id),
      ])
    );
    setTokenCache();
    return {
      user,
      tokens: { access, refresh },
    };
  }
}
