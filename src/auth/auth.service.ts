import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { config } from '../config/configuration-expert';
import { TokenService } from '../jwt-token/jwt-token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../token-refresh/token-refresh.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload, JwtTokenTypes, UserAuth } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private mailService: MailService
  ) {}

  public validateUserOnSignUp(data: object): boolean {
    console.log('validate on signup spare func');
    return true;
  }

  public async signUp(dto: CreateUserDto): Promise<UserAuth> {
    const user = await this.userService.create(dto);
    const { id: tier } = await user.tier;
    const [[access, refresh], set] = await this.tokenService.signTokens({
      userid: user.id,
      role: user.role['id'],
      tier: tier.toString(),
    });
    await this.refreshTokenService.createRecord(refresh, user.id, false);
    this.mailService.sendConfirmationEmail(user);
    set();
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
    const [[access, refresh], set] = await this.tokenService.signTokens({
      userid: user.id,
      role: user.role['id'],
      tier: tier.toString(),
    });
    await this.refreshTokenService.createRecord(refresh, user.id);
    set();
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
    const [[access, refresh], set] = await this.tokenService.signTokens({
      userid: user.id,
      role: user.role['id'],
      tier: tier.toString(),
    });
    const existingRefreshToken = await this.refreshTokenService.getTokenRecordByValue(refreshToken, user.id);

    await config.dataSource.transaction(async () =>
      Promise.all([
        this.refreshTokenService.deleteRecord(existingRefreshToken),
        this.refreshTokenService.createRecord(refresh, user.id),
      ])
    );
    set();
    return {
      user,
      tokens: { access, refresh },
    };
  }
}
