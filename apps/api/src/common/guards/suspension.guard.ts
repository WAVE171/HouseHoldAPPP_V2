import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '../decorators/current-user.decorator';

export const ALLOW_SUSPENDED = 'allowSuspended';

/**
 * Guard that blocks write operations for suspended households.
 *
 * By default, this guard blocks POST, PUT, PATCH, DELETE requests
 * for users whose households are suspended.
 *
 * Use @AllowSuspended() decorator on endpoints that should be
 * accessible even when the household is suspended (like viewing data).
 *
 * Super Admins bypass this check.
 * GET requests are always allowed (read-only access for suspended households).
 */
@Injectable()
export class SuspensionGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const method = request.method.toUpperCase();

    // No user = no check needed (other guards handle auth)
    if (!user) {
      return true;
    }

    // Super admins are never restricted
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    // GET requests are always allowed (read-only access)
    if (method === 'GET') {
      return true;
    }

    // Check if endpoint explicitly allows suspended access
    const allowSuspended = this.reflector.getAllAndOverride<boolean>(
      ALLOW_SUSPENDED,
      [context.getHandler(), context.getClass()],
    );

    if (allowSuspended) {
      return true;
    }

    // No household = no suspension check needed
    if (!user.householdId) {
      return true;
    }

    // Check if household is suspended
    const household = await this.prisma.household.findUnique({
      where: { id: user.householdId },
      select: { status: true },
    });

    if (household?.status === 'SUSPENDED') {
      throw new ForbiddenException(
        'Your household account is suspended. You cannot make changes until it is reactivated. Contact support for assistance.',
      );
    }

    return true;
  }
}
