import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { config } from '../config/configuration-expert';
import { JwtPayload, JwtTokenTypes } from '../types';
import { createKey, getSecondsFromConfig } from '../utils/helpers';

export const JwtOptions: Record<JwtTokenTypes, JwtSignOptions> = {
  [JwtTokenTypes.ACCESS]: {
    expiresIn: config.get('app.jwt.timeAccess'),
  },
  [JwtTokenTypes.REFRESH]: {
    expiresIn: config.get('app.jwt.timeRefresh'),
  },
  [JwtTokenTypes.EMAIL]: {
    expiresIn: config.get('app.jwt.timeAccess'),
  },
};

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async verifyConfirmEmailToken(token): Promise<any> {
    return this.verifyToken(token, JwtTokenTypes.EMAIL);
  }

  public async verifyToken(token: string, type: JwtTokenTypes): Promise<any> {
    return this.jwtService.verifyAsync(token, JwtOptions[type]);
  }

  public async createConfirmEmailToken(user): Promise<string> {
    return this.jwtService.signAsync({ id: user.id }, JwtOptions.REFRESH);
  }

  public async signTokens(payload: JwtPayload): Promise<[string, string]> {
    /* TODO: Implement the whitelist of tokens. To increase the auth secureness */
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.ACCESS]),
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.REFRESH]),
    ]);
    const accessPayload = await this.jwtService.verifyAsync(access, JwtOptions[JwtTokenTypes.ACCESS]);
    this.cacheManager.set(createKey(payload.userid, accessPayload['iat']), access, {
      ttl: getSecondsFromConfig(JwtOptions.ACCESS.expiresIn as string),
    });
    return [access, refresh];
  }
}
