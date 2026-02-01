import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsEmail, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

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
