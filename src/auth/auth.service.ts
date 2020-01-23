import { Injectable, Inject, forwardRef, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as md5 from 'md5';
import * as _ from 'lodash';

import { CONFIG } from '../config';
import { LoginCredentials, TokenContainer, JwtPayload } from './auth.dto';
import { UserService } from '../users/user.service';
import { User } from '../users/user.dto';


@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {}

  async createTokenFromRefreshToken(user: User): Promise<TokenContainer> {
    // Is auth protected in controller so would have provided a valid JWT in order
    // to get to here, so now just issue a new token.
    return this._createToken(user);
  }

  // WARNING: not auth protected in controller
  async createTokenFromCredentials(credentials: LoginCredentials): Promise<TokenContainer> {
    const user = await this.userService.getByCredentials(credentials);

    // If all is good, generate a token containing user data and return token to user
    return this._createToken(user);
  }

  private _createToken(user: User): TokenContainer {
    const payload: JwtPayload = {
      userId: user._id
    };
    return {
      token: jwt.sign(payload, CONFIG.secretKey, { expiresIn: CONFIG.tokenTTL }),
      refreshToken: jwt.sign(payload, CONFIG.secretKey, { expiresIn: CONFIG.tokenTTL + CONFIG.refreshTokenAdditionalTTL }),
      user: user
    } as TokenContainer;
  }

}
