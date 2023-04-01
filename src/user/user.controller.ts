import { Body, Controller, Get, Param, Put, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryParser } from '../utils/decorator/QueryParser';
import { CurrentUser } from '../utils/decorator/CurrentUser';
import { RolesEnum } from '../role/role.entity';
import { JwtPayload } from '../types';

const UserQueryParser = (): MethodDecorator => QueryParser(User);

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UserQueryParser()
  findAll(@Query() opts: object): Promise<Partial<User[]>> {
    return this.userService.findAll(opts);
  }

  @Get('currentuser')
  getCurrentUser(@CurrentUser() user: JwtPayload): Promise<Partial<User>> | void {
    return this.userService.findOneById(Number(user.userid), Number(user.tier));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<Partial<User>> {
    return this.userService.findOneById(+id, Number(user.tier));
  }

  @Put(':id')
  //@UseInterceptors(FileInterceptor('user-photo',{ limits: { fileSize: Mbyte, files: 6 } }))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload
  ): Promise<Partial<User>> {
    /*TODO: create middleware to check admin rights*/
    if (user.role !== RolesEnum.ADMIN && id !== user.userid) {
      throw new BadRequestException('Not enough rights');
    }
    return this.userService.update(Number(id), updateUserDto, user.tier);
  }
}
