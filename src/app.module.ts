import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG } from './config';
import { logger } from './common/middlewares/logger.middleware';
import { AuthGuard2 } from './common/guards/auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { PaginationService } from './common/pagination/pagination.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSchema } from './users/user.schema';
import { UsersController } from './users/users.controller';
import { UserService } from './users/user.service';
import { CourseSchema } from './courses/course.schema';
import { CoursesController } from './courses/courses.controller';
import { CourseService } from './courses/course.service';


@Module({
  imports: [
    JwtModule.register({
      secretOrPrivateKey: CONFIG.secretKey,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    MongooseModule.forRoot(CONFIG.dbConnection),
    MongooseModule.forFeature([
      {name: 'User', schema: UserSchema},
      {name: 'Course', schema: CourseSchema},
    ])
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    CoursesController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    JwtStrategy,
    AuthService,
    PaginationService,
    AppService,
    UserService,
    CourseService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log(CONFIG.dbConnection);
    consumer
      .apply(logger)
      .forRoutes(
        AuthController,
        UsersController,
        CoursesController,
      );
  }
}
