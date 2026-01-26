import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { HouseholdGuard } from '../../common/guards/household.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Household } from '../../common/decorators/household.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto, AuditLogQueryDto, CreateAuditLogDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, HouseholdGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // User management
  @Get('users')
  getAllUsers(@Household('id') householdId: string) {
    return this.adminService.getAllUsers(householdId);
  }

  @Get('users/:id')
  getUserById(@Param('id') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Patch('users/:id/role')
  updateUserRole(
    @CurrentUser('id') adminId: string,
    @Param('id') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(adminId, userId, dto.role);
  }

  @Post('users/:id/lock')
  lockUser(
    @Param('id') userId: string,
    @Body('lockedUntil') lockedUntil?: string,
  ) {
    return this.adminService.lockUser(
      userId,
      lockedUntil ? new Date(lockedUntil) : undefined,
    );
  }

  @Post('users/:id/unlock')
  unlockUser(@Param('id') userId: string) {
    return this.adminService.unlockUser(userId);
  }

  @Post('users/:id/revoke-sessions')
  revokeUserSessions(@Param('id') userId: string) {
    return this.adminService.revokeUserSessions(userId);
  }

  // Household management
  @Get('household')
  getHouseholdInfo(@Household('id') householdId: string) {
    return this.adminService.getHouseholdInfo(householdId);
  }

  // Audit logs
  @Get('audit-logs')
  getAuditLogs(@Query() query: AuditLogQueryDto) {
    return this.adminService.getAuditLogs(query);
  }

  @Post('audit-logs')
  createAuditLog(@Body() dto: CreateAuditLogDto) {
    return this.adminService.createAuditLog(dto);
  }

  // System stats (for super admin view)
  @Get('system-stats')
  getSystemStats() {
    return this.adminService.getSystemStats();
  }
}
