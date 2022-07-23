import { Body, Controller, Get, Param, Put, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryParser } from '../utils/decorator/QueryParser';
import { CurrentUser } from '../utils/decorator/CurrentUser';
import { RolesEnum } from '../role/role.entity';
import { JwtPayload } from '../types';

const UserQueryParser = (): MethodDecorator =>
  QueryParser(User, {
    fields: ['id', 'login', 'email', 'status', 'lastModified', 'createDate'],
    relations: ['role'],
  });

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UserQueryParser()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() opts: object, @Request() r): Promise<Partial<User[]>> {
    console.log(r);
    return this.userService.findAll(opts);
  }

  @Get('currentuser')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: JwtPayload): Promise<Partial<User>> | void {
    return this.userService.findOneById(Number(user.userid));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Partial<User>> {
    return this.userService.findOneById(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload
  ): Promise<Partial<User>> {
    /*TODO: create middleware to check admin rights*/
    if (user.role !== RolesEnum.ADMIN && id !== user.userid) {
      throw new BadRequestException('Not enough rights');
    }
    return this.userService.update(Number(id), updateUserDto);
  }
}
