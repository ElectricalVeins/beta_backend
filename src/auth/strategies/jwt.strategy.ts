import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from 'src/config/configuration-expert';
import { addMinutes, isAfter } from 'date-fns';
import { deleteLastCharInString } from '../../utils/helpers';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly time: number;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwt.secret'),
    });
    const time = Number(deleteLastCharInString(config.get('app.jwt.timeAccess')));
    if (Number.isNaN(time)) {
      throw new Error('Invalid config: app.jwt.timeAccess');
    }
    this.time = time;
  }

  validate(payload: object): object {
    const maxPossibleDate = addMinutes(Date.now(), this.time);
    const tokenDate = new Date(Number(`${payload['exp']}000`)); // amount of seconds to ms
    if (isAfter(tokenDate, maxPossibleDate)) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }
}
