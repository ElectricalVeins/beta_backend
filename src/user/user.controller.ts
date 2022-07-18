import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
// import { Roles } from 'src/utils/decorator/roles.decorator';
// import { RolesEnum } from 'src/role/role.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @Roles(RolesEnum.ADMIN, RolesEnum.USER, RolesEnum.PREMIUM)
  @UseGuards(JwtAuthGuard)
  findAll(@Query() opts: object): Promise<Partial<User[]>> {
    return this.userService.findAll(opts);
  }

  @Get(':id')
  // @Roles(RolesEnum.ADMIN, RolesEnum.USER, RolesEnum.PREMIUM)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Partial<User>> {
    return this.userService.findOneById(+id);
  }

  @Get('currentuser')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(): Promise<Partial<User>> | void {
    // return this.userService.getCurrentUser();
  }

  @Put(':id')
  // @Roles(RolesEnum.ADMIN, RolesEnum.USER, RolesEnum.PREMIUM)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    /* check user can update only himself */
    return this.userService.update(+id, updateUserDto);
  }
}
