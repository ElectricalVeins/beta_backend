import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { config } from '../config/configuration-expert';
import { TokenService } from '../jwt-token/jwt-token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from '../token-refresh/token-refresh.service';
import { MailService } from '../mail/mail.service';
import { JwtTokenTypes, UserAuth } from '../types';

/* TODO: SEPARATE SECRETS FOR TOKENS */

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
    const [access, refresh] = await this.tokenService.signTokens({ userid: user.id, role: user.role['id'] });
    await this.refreshTokenService.createRecord(refresh, user.id, false);
    this.mailService.sendConfirmationEmail(user);
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

    const isCorrectPassword = await this.userService.checkPassword(user, dto.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect login or password');
    }
    const [access, refresh] = await this.tokenService.signTokens({ userid: user.id, role: user.role['id'] });
    await this.refreshTokenService.createRecord(refresh, user.id);
    return {
      user,
      tokens: { access, refresh },
    };
  }

  public async refreshSession(authHeader: string): Promise<UserAuth> {
    const [type, refreshToken] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Wrong token type');
    }
    // TODO: if not verified token is expired - delete record. Use redis to store tokens? Write a sql func?
    const { id } = await this.tokenService.verifyToken(refreshToken, JwtTokenTypes.REFRESH);
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }
    const [access, refresh] = await this.tokenService.signTokens({ userid: user.id, role: user.role['id'] });

    const [existingRefreshToken] = await Promise.all([
      this.refreshTokenService.getTokenRecordByValue(refreshToken, user.id),
    ]);
    await config.dataSource.transaction(async () => {
      return Promise.all([
        this.refreshTokenService.deleteRecord(existingRefreshToken),
        this.refreshTokenService.createRecord(refresh, user.id),
      ]);
    });
    return {
      user,
      tokens: { access, refresh },
    };
  }
}
