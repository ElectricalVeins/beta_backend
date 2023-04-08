import { addMinutes, isAfter } from 'date-fns';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import config from '../../config/configuration-expert';
import { getSecondsFromConfig, timeAccess } from '../../utils/helpers';
import { JwtPayload } from '../../types';
import { TokenService } from '../../jwt-token/jwt-token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly time: number;

  constructor(
    /*Inject Repo if need*/
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly tokenService: TokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwt.secretAccess'),
    });
    this.time = getSecondsFromConfig(timeAccess);
  }

  async validate(payload: JwtPayload): Promise<object> {
    /* TODO: AUTH | Check deprecated sessions in blacklist. */
    /*Disable long-living tokens*/
    const maxPossibleDate = addMinutes(Date.now(), this.time);
    const tokenDate = new Date(Number(`${payload['exp']}000`)); // amount of seconds to ms
    if (isAfter(tokenDate, maxPossibleDate)) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }
}
