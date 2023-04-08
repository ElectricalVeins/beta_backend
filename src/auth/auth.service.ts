import { CACHE_MANAGER, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
import { TokenService } from '../jwt-token/jwt-token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../token-refresh/token-refresh.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload, JwtTokenTypes, UserAuth } from '../types';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

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
    try {
      this.mailService.sendConfirmationEmail(user);
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
    return await this.userService.activateUser(userid, tier);
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

  public async getExistingSessions(userId: number): Promise<object[]> {
    const keys = await this.cacheManager.store.keys(this.tokenService.createTokenKey(String(userId), '*'));
    const tokens = await Promise.all<object>(keys.map(async (key) => this.cacheManager.get<object>(key)));
    // TODO: return session info, instead of token list
    return tokens;
  }
}
