import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { HouseholdService } from './household.service';
import {
  UpdateHouseholdDto,
  InviteMemberDto,
  HouseholdResponseDto,
  HouseholdMemberDto,
} from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

// Extend Request to include householdId from guard
interface RequestWithHousehold extends Request {
  householdId?: string;
}

@ApiTags('household')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('household')
export class HouseholdController {
  constructor(private householdService: HouseholdService) {}

  private getHouseholdId(user: JwtPayload, req: RequestWithHousehold): string {
    const householdId = req.householdId || user.householdId;
    if (!householdId) {
      throw new ForbiddenException(
        'Super Admins must specify a householdId. Use the Admin panel to manage households.',
      );
    }
    return householdId;
  }

  @Get()
  @ApiOperation({ summary: 'Get current household' })
  @ApiResponse({
    status: 200,
    description: 'Household retrieved',
    type: HouseholdResponseDto,
  })
  async getHousehold(
    @CurrentUser() user: JwtPayload,
    @Req() req: RequestWithHousehold,
  ): Promise<HouseholdResponseDto> {
    return this.householdService.getHousehold(this.getHouseholdId(user, req));
  }

  @Patch()
  @ApiOperation({ summary: 'Update household details' })
  @ApiResponse({
    status: 200,
    description: 'Household updated',
    type: HouseholdResponseDto,
  })
  async updateHousehold(
    @CurrentUser() user: JwtPayload,
    @Req() req: RequestWithHousehold,
    @Body() updateDto: UpdateHouseholdDto,
  ): Promise<HouseholdResponseDto> {
    return this.householdService.updateHousehold(
      this.getHouseholdId(user, req),
      user.sub,
      updateDto,
    );
  }

  @Get('members')
  @ApiOperation({ summary: 'Get household members' })
  @ApiResponse({
    status: 200,
    description: 'Members list',
    type: [HouseholdMemberDto],
  })
  async getMembers(
    @CurrentUser() user: JwtPayload,
    @Req() req: RequestWithHousehold,
  ): Promise<HouseholdMemberDto[]> {
    return this.householdService.getMembers(this.getHouseholdId(user, req));
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite new member to household' })
  @ApiResponse({
    status: 201,
    description: 'Member invited',
    type: HouseholdMemberDto,
  })
  async inviteMember(
    @CurrentUser() user: JwtPayload,
    @Req() req: RequestWithHousehold,
    @Body() inviteDto: InviteMemberDto,
  ): Promise<HouseholdMemberDto> {
    return this.householdService.inviteMember(
      this.getHouseholdId(user, req),
      user.sub,
      inviteDto,
    );
  }

  @Delete('members/:memberId')
  @ApiOperation({ summary: 'Remove member from household' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  async removeMember(
    @CurrentUser() user: JwtPayload,
    @Req() req: RequestWithHousehold,
    @Param('memberId') memberId: string,
  ): Promise<{ success: boolean }> {
    return this.householdService.removeMember(
      this.getHouseholdId(user, req),
      user.sub,
      memberId,
    );
  }
}
