import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isLocked: boolean;

  @IsDateString()
  @IsOptional()
  lockedUntil?: string;
}

export class AuditLogQueryDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  offset?: string;
}

export class CreateAuditLogDto {
  @IsString()
  userId: string;

  @IsString()
  userEmail: string;

  @IsString()
  action: string;

  @IsString()
  resource: string;

  @IsString()
  @IsOptional()
  resourceId?: string;

  @IsOptional()
  details?: Record<string, any>;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;
}
