import { IsString, IsEmail, IsInt, IsBoolean, IsOptional, MaxLength, MinLength, Length, Matches, IsArray, IsIn, IsPhoneNumber, IsDefined } from 'class-validator';

import { CONFIG } from '../config';
import { LoginCredentials } from '../auth/auth.dto';


export class User {
  _id: string;  // ObjectId
  fName: string;
  lName: string;
  email: string;
  password: string;  // Will be encrypted, should remove after get user
  active: boolean;
}

export class UserRegister {
  @IsString()
  @MaxLength(CONFIG.userNameMaxLength, {
    message: `First name is over ${CONFIG.userNameMaxLength} characters.`
  })
  fName: string;

  @IsString()
  @MaxLength(CONFIG.userNameMaxLength, {
    message: `Last name is over ${CONFIG.userNameMaxLength} characters.`
  })
  lName: string;

  @IsEmail()
  @MaxLength(CONFIG.userEmailMaxLength, {
    message: `Email is over ${CONFIG.userEmailMaxLength} characters.`
  })
  email: string;

  @IsString()
  inviteCode: string;

  @IsOptional()
  @IsString()
  defaultPartnerId?: string;
}

// Used internally for "create", which can be part of registration or adding a new member to an org
export class UserCreate {
  @IsString()
  @MaxLength(CONFIG.userNameMaxLength, {
    message: `First name is over ${CONFIG.userNameMaxLength} characters.`
  })
  fName: string;

  @IsString()
  @MaxLength(CONFIG.userNameMaxLength, {
    message: `Last name is over ${CONFIG.userNameMaxLength} characters.`
  })
  lName: string;

  @IsEmail()
  @MaxLength(CONFIG.userEmailMaxLength, {
    message: `Email is over ${CONFIG.userEmailMaxLength} characters.`
  })
  email: string;

  @IsOptional()
  @IsString()
  defaultPartnerId?: string;
}
