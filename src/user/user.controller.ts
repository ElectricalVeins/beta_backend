import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { RolesEnum } from 'src/role/role.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RolesEnum.ADMIN, RolesEnum.USER, RolesEnum.PREMIUM)
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER, RolesEnum.PREMIUM)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER, RolesEnum.PREMIUM)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    /* check user can update only himself */
    return this.userService.update(+id, updateUserDto);
  }
}
