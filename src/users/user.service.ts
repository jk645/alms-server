import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import * as md5 from 'md5';

import { CONFIG } from '../config';
import { User, UserRegister, UserCreate } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginCredentials } from '../auth/auth.dto';
import { filterHtml } from '../common/utilities/filter-html';
import { randomString } from '../common/utilities/random-string';
import { convertMapToArray } from '../common/utilities/convert-map-to-array';
import { convertObjectToMap } from '../common/utilities/convert-object-to-map';


@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {}


  async get(id: string, actingUser?: User): Promise<User> {
    try {
      mongoose.Types.ObjectId(id);
    }
    catch {
      throw new BadRequestException('Malformed userId');
    }

    const result = await this.userModel.findById(id);
    if (!result) {
      throw new NotFoundException();
    }

    return result.toObject();
  }


  async getByCredentials(credentials: LoginCredentials): Promise<User> {
    const user = await this.findOneByEmail(credentials.email, true);
    if (!user) {
      throw new BadRequestException('Login credentials are incorrect');
    }

    // Ensure account is active
    if (!user.active) {
      throw new ForbiddenException('Account disabled');
    }

    // Check provided password
    const providedPasswordHashed = md5(credentials.password);
    if (providedPasswordHashed !== user.password) {
      throw new BadRequestException('Login credentials are incorrect');
    }
    user.password = undefined;  // Once verify password, remove it

    return user;
  }


  // NOTE: This can be performed by an unauthenticated person because it's used to signup for a new account
  async register(data: UserRegister): Promise<User> {
    // TEMP: During beta testing, require inviteCode to prevent unwanted users
    if (data.inviteCode !== CONFIG.userInviteCode) {
      throw new NotFoundException();
    }

    // Check for existing user record with given email
    let existingUser = await this.findOneByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Cannot use that email');
    }

    // Trim fName and lName
    data.fName = data.fName.trim();
    data.lName = data.lName.trim();

    // Create user if not already exist
    if (!existingUser) {
      const userCreateData = {
        fName: data.fName,
        lName: data.lName,
        email: data.email,
        defaultPartnerId: data.defaultPartnerId ? data.defaultPartnerId : null
      };
      existingUser = await this.create(userCreateData);
    }

    // Ensure sensitive properties are not seen
    return this._userSecurityClean(existingUser);
  }


  private _userSecurityClean(user: User, keepMemberships?: boolean, keepPaymentInfo?: boolean): User {
    const cleanUser = {
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
    } as User;

    return cleanUser;
  }


  // WARNING: for internal use only, doesn't have logic to validate requesting user's privileges
  async validateUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    // Ensure account is active
    if (!user.active) throw new Error('User is not active');

    // Thanks to '@nestjs/passport' AuthGuard, the User returned from the DB gets appended to the request as 'user'
    return user;
  }


  // WARNING: for internal use only, doesn't have logic to validate requesting user's privileges
  async findOneByEmail(email: string, keepPassword?: boolean): Promise<User> {
    const result = await this.userModel.findOne({ email: String(email).trim().toLowerCase() });  // Emails should have been stored in lowercase
    if (result && !keepPassword) {
      result.password = undefined;  // Should be encrypted, but still remove password so it doesn't end up in wrong place by accident
    }
    return result;
  }


  // WARNING: for internal use only, doesn't have logic to validate requesting user's privileges
  async create(data: UserCreate, actingUser?: User): Promise<User> {
    const validationErrors = await validate(plainToClass(UserCreate, data), {
      whitelist: true,
      forbidNonWhitelisted: true
    });
    if (validationErrors.length > 0) {
      throw new BadRequestException('Cannot create user. Invalid data provided.');
    }

    const userData = {
      fName: filterHtml(data.fName.trim()),
      lName: filterHtml(data.lName.trim()),
      email: filterHtml(data.email.trim().toLowerCase()),  // Always store email in lowercase
      password: null,  // Won't get added until user verifies their email
      active: true,
    };

    // Ensure existing user doesn't have this email
    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('Cannot use that email');
    }

    // First create the new user
    let newUser = await this.userModel.create(userData);

    // Ensure sensitive properties are not seen
    return this._userSecurityClean(newUser);
  }

}
