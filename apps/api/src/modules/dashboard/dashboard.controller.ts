import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { HouseholdGuard } from '../../common/guards/household.guard';
import { Household } from '../../common/decorators/household.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, HouseholdGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Household('id') householdId: string) {
    return this.dashboardService.getStats(householdId);
  }

  @Get('recent-activity')
  getRecentActivity(
    @Household('id') householdId: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.getRecentActivity(
      householdId,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('upcoming-tasks')
  getUpcomingTasks(
    @Household('id') householdId: string,
    @Query('days') days?: string,
  ) {
    return this.dashboardService.getUpcomingTasks(
      householdId,
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get('upcoming-events')
  getUpcomingEvents(
    @Household('id') householdId: string,
    @Query('days') days?: string,
  ) {
    return this.dashboardService.getUpcomingEvents(
      householdId,
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get('expiring-items')
  getExpiringItems(
    @Household('id') householdId: string,
    @Query('days') days?: string,
  ) {
    return this.dashboardService.getExpiringItems(
      householdId,
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get('finance-summary')
  getFinanceSummary(@Household('id') householdId: string) {
    return this.dashboardService.getFinanceSummary(householdId);
  }
}
