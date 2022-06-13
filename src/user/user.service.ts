import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    try {
      /* validate user */
      /* check user email and login on uniqueness (via hooks or simply catch the error) */
      /* hash password */
      /* create user */
      /* return user without password */
      /* create token pair */
      /* return user and token pair */
    } catch (e) {
      /* ??? */
    }
    return JSON.stringify(createUserDto);
  }

  findAll() {
    /* check rights */
    /* return users for admin panel */
    return [];
  }

  findOne(id: ID) {
    /* check user rights */
    /* check token */
    /* return user */
    return `This action returns a #${id} user`;
  }

  update(id: ID, updateUserDto: UpdateUserDto) {
    /* check rights */
    /* check token */
    /* check updateable fields for user */
    /* update and return */
    return `This action updates a #${id} user`;
  }
}
