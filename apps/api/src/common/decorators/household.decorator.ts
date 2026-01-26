import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Household = createParamDecorator(
  (data: 'id' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const householdId = request.householdId;

    if (!householdId) {
      return null;
    }

    // If 'id' is passed as data, return the householdId directly
    return data === 'id' ? householdId : { id: householdId };
  },
);
