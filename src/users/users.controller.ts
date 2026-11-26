import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { User } from './user.model.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.users.findAll();
  }

  @Get('me')
  me(@CurrentUser() user: User): User {
    return user;
  }

  @Get(':userId')
  findOne(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.users.findOne(userId);
  }
}
