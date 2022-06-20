import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  public validateUserOnSignUp(data: any): any {
    return true;
  }

  public async signUp(dto: CreateUserDto): Promise<{ user; tokens }> {
    const user = await this.userService.create(dto);
    const access = await this.signToken({ id: user.id, role: user.role });
    return {
      user,
      tokens: { access },
    };
  }

  private async signToken(payload): Promise<any> {
    return {
      access: this.jwtService.sign(payload),
    };
  }
}
