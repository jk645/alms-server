import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CONFIG } from '../config';
import { UserService } from '../users/user.service';
import { JwtPayload } from './auth.dto';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: CONFIG.secretKey,
    });
  }

  async validate(payload: JwtPayload, done: Function) {
    // Signature is automatically validated before this, and so is "exp" if provided
    try {
      var user = await this.userService.validateUser(payload.userId);
    }
    catch (error) {
      // Return 401 error so that front end can handle accordingly
      return done(new UnauthorizedException(), false);
    }
    // Thanks to '@nestjs/passport' AuthGuard, the User returned from the DB gets appended to the request as 'user'
    done(null, user);
  }
}
