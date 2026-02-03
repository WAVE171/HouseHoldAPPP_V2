import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsEmail, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}

// Household management DTOs
export class CreateHouseholdDto {
  @ApiProperty({ description: 'Household name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Household address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Household phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Admin email' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ description: 'Admin first name' })
  @IsString()
  adminFirstName: string;

  @ApiProperty({ description: 'Admin last name' })
  @IsString()
  adminLastName: string;

  @ApiPropertyOptional({ description: 'Admin password (generated if not provided)' })
  @IsString()
  @IsOptional()
  adminPassword?: string;
}

export class AdminUpdateHouseholdDto {
  @ApiPropertyOptional({ description: 'Household name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Household address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Household phone' })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class AssignHouseholdAdminDto {
  @ApiProperty({ description: 'User ID to assign as admin' })
  @IsString()
  userId: string;
}

export class HouseholdsQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Search by name' })
  @IsOptional()
  @IsString()
  search?: string;
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

// DTO for Super Admin to create users directly
export class AdminCreateUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'User password (generated if not provided)' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'User role', enum: ['SUPER_ADMIN', 'ADMIN', 'PARENT', 'MEMBER', 'STAFF'] })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({ description: 'Household ID to assign the user to (optional for SUPER_ADMIN users)' })
  @IsString()
  @IsOptional()
  householdId?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  @IsString()
  @IsOptional()
  phone?: string;
}

// Subscription management DTOs
export class SubscriptionsQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by plan' })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional({ description: 'Search by household name' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ description: 'New plan' })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @ApiPropertyOptional({ description: 'New status' })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}

export class ExtendTrialDto {
  @ApiProperty({ description: 'Number of days to extend trial' })
  @IsNumber()
  @Min(1)
  @Max(90)
  days: number;
}

export class CancelSubscriptionDto {
  @ApiPropertyOptional({ description: 'Cancellation reason' })
  @IsOptional()
  @IsString()
  reason?: string;
}

// System settings DTO
export class UpdateSystemSettingsDto {
  @ApiPropertyOptional({ description: 'Site name' })
  @IsOptional()
  @IsString()
  siteName?: string;

  @ApiPropertyOptional({ description: 'Support email' })
  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @ApiPropertyOptional({ description: 'Default trial days' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(90)
  defaultTrialDays?: number;

  @ApiPropertyOptional({ description: 'Enable maintenance mode' })
  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @ApiPropertyOptional({ description: 'Enable user registration' })
  @IsOptional()
  @IsBoolean()
  registrationEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Max login attempts before lockout' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxLoginAttempts?: number;

  @ApiPropertyOptional({ description: 'Session timeout in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(1440)
  sessionTimeout?: number;

  @ApiPropertyOptional({ description: 'Enable email notifications' })
  @IsOptional()
  @IsBoolean()
  emailNotificationsEnabled?: boolean;
}
