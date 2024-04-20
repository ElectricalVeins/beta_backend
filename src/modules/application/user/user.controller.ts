import { Body, Controller, Get, Param, Put, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { QueryParser } from '../../../utils/decorators/QueryParser';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../../../types';
import { CurrentUser } from '../../../utils/decorators/CurrentUser';
import { RolesEnum } from '../role/role.entity';

const UserQueryParser = (): MethodDecorator => QueryParser(User);

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('User')
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
