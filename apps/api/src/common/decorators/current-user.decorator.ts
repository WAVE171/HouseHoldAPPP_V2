import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  householdId?: string;
  householdStatus?: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}

// Extended type that maps 'id' to 'sub'
type UserDataKey = keyof JwtPayload | 'id';

export const CurrentUser = createParamDecorator(
  (data: UserDataKey | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      return null;
    }

    // Map 'id' to 'sub' for convenience
    if (data === 'id') {
      return user.sub;
    }

    return data ? user[data] : user;
  },
);
