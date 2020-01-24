import { Injectable, Inject, forwardRef, BadRequestException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';

import { CONFIG } from '../config';
import { Course, CourseQuery } from './course.dto';
import { User } from '../users/user.dto';
import { Page } from '../common/pagination/page.dto';
import { PaginationService } from '../common/pagination/pagination.service';


@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private readonly courseModel: Model<Course>,
    private readonly paginationService: PaginationService
  ) {}


  async get(id: string, user?: User): Promise<Course> {
    try {
      mongoose.Types.ObjectId(id);
    }
    catch {
      throw new BadRequestException('Malformed id');
    }

    let result = await this.courseModel.findById(id);
    if (!result) {
      throw new NotFoundException();
    }

    return result.toObject();
  }


  async find(query: CourseQuery, user: User, findAll?: boolean): Promise<Page> {
    const limit = findAll ? 0 : Number(query.limit || CONFIG.defaultPageSize);
    const skip = findAll ? 0 : Number(query.skip || 0);
    const sortBy = query.sortBy || 'createdDate';
    const orderBy = (query.orderBy === 'asc') ? 1 : -1;  // Defaults to 'desc'
    let conditions = {} as any;

    const result = await this.courseModel.find(conditions, null, {
      limit: limit,
      skip: skip,
      sort: {
        [sortBy]: orderBy
      }
    });
    const total = await this.courseModel.countDocuments(conditions);
    return this.paginationService.generatePage(result, limit, skip, total);
  }

}
