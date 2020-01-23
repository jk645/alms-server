import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginCredentials, TokenContainer } from './auth.dto';
import { User } from '../users/user.dto';


@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async createTokenFromRefreshToken(@Request() req: any): Promise<TokenContainer> {
    let user = req.user as User;
    return await this.authService.createTokenFromRefreshToken(user);
  }

  @Post()
  async createTokenFromCredentials(@Body() body: LoginCredentials): Promise<TokenContainer> {
    return await this.authService.createTokenFromCredentials(body);
  }

}
