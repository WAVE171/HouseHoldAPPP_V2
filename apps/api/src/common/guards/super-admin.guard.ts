import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      return false;
    }

    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'This action is restricted to system administrators only',
      );
    }

    return true;
  }
}
