import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryParser } from '../utils/decorator/QueryParser';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @QueryParser(User, ['id', 'login', 'status'])
  @UseGuards(JwtAuthGuard)
  findAll(@Query() opts: object): Promise<Partial<User[]>> {
    return this.userService.findAll(opts);
  }

  @Get(':id')
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
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    /* check user can update only himself */
    return this.userService.update(+id, updateUserDto);
  }
}
