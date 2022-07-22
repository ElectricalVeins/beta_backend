import { addMinutes, isAfter } from 'date-fns';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { config } from '../../config/configuration-expert';
import { createKey, getSecondsFromConfig, timeAccess } from '../../utils/helpers';
import { JwtPayload } from '../../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly time: number;

  constructor(/*Inject Repo if need*/ @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwt.secret'),
    });
    this.time = getSecondsFromConfig(timeAccess);
  }

  async validate(payload: JwtPayload): Promise<object> {
    /*Check access token in whitelist*/
    const token = await this.cacheManager.get(createKey(payload.userid, payload['iat']));
    if (!token) {
      throw new BadRequestException('Invalid token');
    }
    /*Disable long-living tokens*/
    const maxPossibleDate = addMinutes(Date.now(), this.time);
    const tokenDate = new Date(Number(`${payload['exp']}000`)); // amount of seconds to ms
    if (isAfter(tokenDate, maxPossibleDate)) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }
}
