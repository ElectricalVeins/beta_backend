import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    try {
      const t = new User();
      const repo = User.getRepository();
      console.log(t);
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }

    return JSON.stringify(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: ID) {
    return `This action returns a #${id} user`;
  }

  update(id: ID, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
