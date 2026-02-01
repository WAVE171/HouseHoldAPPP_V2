import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class HouseholdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      return false;
    }

    // Super admins bypass household check - they can access any household
    if (user.role === 'SUPER_ADMIN') {
      // For super admins, householdId might come from query param or route param
      const householdIdFromQuery = request.query?.householdId;
      const householdIdFromParam = request.params?.householdId;
      request.householdId = householdIdFromQuery || householdIdFromParam || user.householdId;
      return true;
    }

    // Check if user has a household
    if (!user.householdId) {
      throw new ForbiddenException(
        'You must belong to a household to access this resource',
      );
    }

    // Store householdId on request for easy access in controllers
    request.householdId = user.householdId;

    return true;
  }
}
