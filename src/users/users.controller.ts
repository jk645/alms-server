import { Controller, Header, Get, Post, Patch, Delete, Param, Request, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CONFIG } from '../config';
import { UserService } from './user.service';
import { User, UserRegister } from './user.dto';


@Controller('api/users')
export class UsersController {
  constructor(
    private readonly userService: UserService
  ) {}

  // NOTE: This can be performed by an unauthenticated person because it's used to signup for a new account
  @Post('register')
  async register(@Body() body: UserRegister): Promise<User> {
    return await this.userService.register(body);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async get(@Param('id') id: string, @Request() req: any): Promise<User> {
    const actingUser = req.user as User;
    return await this.userService.get(id, actingUser);
  }

}
