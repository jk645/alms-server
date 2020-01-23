import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';


@Injectable()
export class AuthGuard2 implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // TODO: see NestJS documentation, "Guards", "Role-based authentication" and "Reflector" for how can gaurd based on role and such in future
    console.log(request.user);
    return true;
  }
}
