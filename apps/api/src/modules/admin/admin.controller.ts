import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { HouseholdGuard } from '../../common/guards/household.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Household } from '../../common/decorators/household.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import {
  UpdateUserRoleDto,
  AuditLogQueryDto,
  CreateAuditLogDto,
  CreateHouseholdDto,
  AdminUpdateHouseholdDto,
  HouseholdsQueryDto,
  AssignHouseholdAdminDto,
  AdminCreateUserDto,
} from './dto/admin.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ============================================
  // HOUSEHOLD ADMIN ENDPOINTS
  // ============================================

  // User management (for household admin)
  @Get('users')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all users in household' })
  getAllUsers(@Household('id') householdId: string) {
    return this.adminService.getAllUsers(householdId);
  }

  @Get('users/:id')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get user by ID' })
  getUserById(@Param('id') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Patch('users/:id/role')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update user role' })
  updateUserRole(
    @CurrentUser('id') adminId: string,
    @Param('id') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(adminId, userId, dto.role);
  }

  @Post('users/:id/lock')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Lock user account' })
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
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Unlock user account' })
  unlockUser(@Param('id') userId: string) {
    return this.adminService.unlockUser(userId);
  }

  @Post('users/:id/revoke-sessions')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Revoke all user sessions' })
  revokeUserSessions(@Param('id') userId: string) {
    return this.adminService.revokeUserSessions(userId);
  }

  // Household info (for household admin)
  @Get('household')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get current household info' })
  getHouseholdInfo(@Household('id') householdId: string) {
    return this.adminService.getHouseholdInfo(householdId);
  }

  // Audit logs
  @Get('audit-logs')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get audit logs' })
  getAuditLogs(@Query() query: AuditLogQueryDto) {
    return this.adminService.getAuditLogs(query);
  }

  @Post('audit-logs')
  @UseGuards(HouseholdGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create audit log entry' })
  createAuditLog(@Body() dto: CreateAuditLogDto) {
    return this.adminService.createAuditLog(dto);
  }

  // ============================================
  // SUPER ADMIN ONLY ENDPOINTS
  // ============================================

  // System stats (for super admin view)
  @Get('system/stats')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Get system-wide statistics (Super Admin only)' })
  getSystemStats() {
    return this.adminService.getSystemStats();
  }

  // Get all households
  @Get('households')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'List all households (Super Admin only)' })
  getAllHouseholds(@Query() query: HouseholdsQueryDto) {
    return this.adminService.getAllHouseholds(query);
  }

  // Create new household
  @Post('households')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Create a new household (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Household created successfully' })
  createHousehold(@Body() dto: CreateHouseholdDto) {
    return this.adminService.createHousehold(dto);
  }

  // Get household by ID
  @Get('households/:householdId')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Get household details (Super Admin only)' })
  getHouseholdById(@Param('householdId') householdId: string) {
    return this.adminService.getHouseholdInfo(householdId);
  }

  // Update household
  @Patch('households/:householdId')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Update household (Super Admin only)' })
  updateHousehold(
    @Param('householdId') householdId: string,
    @Body() dto: AdminUpdateHouseholdDto,
  ) {
    return this.adminService.updateHouseholdById(householdId, dto);
  }

  // Delete household
  @Delete('households/:householdId')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Delete household (Super Admin only)' })
  deleteHousehold(@Param('householdId') householdId: string) {
    return this.adminService.deleteHousehold(householdId);
  }

  // Get household members
  @Get('households/:householdId/members')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Get household members (Super Admin only)' })
  getHouseholdMembers(@Param('householdId') householdId: string) {
    return this.adminService.getHouseholdMembers(householdId);
  }

  // Assign household admin
  @Post('households/:householdId/admin')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Assign household admin (Super Admin only)' })
  assignHouseholdAdmin(
    @Param('householdId') householdId: string,
    @Body() dto: AssignHouseholdAdminDto,
  ) {
    return this.adminService.assignHouseholdAdmin(householdId, dto.userId);
  }

  // Get all users system-wide
  @Get('system/users')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Get all users across all households (Super Admin only)' })
  getAllUsersSystemWide(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAllUsersSystemWide(page, limit);
  }

  // Create user directly (Super Admin only)
  @Post('system/users')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Create a new user directly (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  createUser(@Body() dto: AdminCreateUserDto) {
    return this.adminService.createUser(dto);
  }
}
