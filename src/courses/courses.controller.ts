import { Controller, Header, Get, Post, Patch, Delete, Param, Request, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CONFIG } from '../config';
import { CourseService } from './course.service';
import { Course, CourseQuery } from './course.dto';
import { User } from '../users/user.dto';
import { Page } from '../common/pagination/page.dto';


@Controller('api/courses')
@UseGuards(AuthGuard('jwt'))
export class CoursesController {
  constructor(
    private readonly courseService: CourseService
  ) {}

  @Get(':id')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async get(@Param('id') id: string, @Request() req: any): Promise<Course> {
    const user = req.user as User;
    return await this.courseService.get(id, user);
  }

  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async find(@Query() query: CourseQuery, @Request() req: any): Promise<Page> {
    const user = req.user as User;
    return await this.courseService.find(query, user);
  }

}
