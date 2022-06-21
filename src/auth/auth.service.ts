import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  public validateUserOnSignUp(data: any): any {
    return true;
  }

  public async signUp(dto: CreateUserDto): Promise<{ user; tokens }> {
    const user = await this.userService.create(dto);
    const access = await this.signToken({ id: user.id, role: user.role });
    // const refresh = await this.signToken({ id: user.id, role: user.role });
    return {
      user: user.toResource(),
      tokens: { access, refresh: '' },
    };
  }

  public async signIn(dto): Promise<{ user; tokens }> {
    const user = await this.userService.findOneByLoginOrEmail(dto.login);
    if (!user) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    const isCorrectPassword = await this.userService.checkPassword(user, dto.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    const access = await this.signToken({ id: user.id, role: user.role });
    // const refresh = await this.signToken({ id: user.id, role: user.role });
    return {
      user: user.toResource(),
      tokens: { access, refresh: '' },
    };
  }

  private async signToken(payload: object, opts?: JwtSignOptions): Promise<any> {
    return this.jwtService.sign(payload, opts);
  }
}
