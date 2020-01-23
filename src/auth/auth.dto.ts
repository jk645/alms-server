import { IsString, IsEmail } from 'class-validator';

import { User } from '../users/user.dto';


export class LoginCredentials {
  // Not providing the same validation here as when creating/editing credentials,
  // because if change requirements, existing credentials in the system will still
  // match the old requirements. This takes whatever and if it's not valid, it's
  // simply not valid, and user cannot login.
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class TokenContainer {
  token: string;  // JWT
  refreshToken: string;  // JWT
  user: User;
}

export class JwtPayload {
  userId: string;  // ObjectId
}
