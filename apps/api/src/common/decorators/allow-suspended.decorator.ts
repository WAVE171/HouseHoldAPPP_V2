import { SetMetadata } from '@nestjs/common';
import { ALLOW_SUSPENDED } from '../guards/suspension.guard';

/**
 * Decorator to mark an endpoint as accessible even when the household is suspended.
 * By default, write operations (POST, PUT, PATCH, DELETE) are blocked for suspended households.
 * Use this decorator to allow specific endpoints.
 *
 * @example
 * @AllowSuspended()
 * @Post('contact-support')
 * contactSupport() { ... }
 */
export const AllowSuspended = () => SetMetadata(ALLOW_SUSPENDED, true);
