import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { KidsService } from './kids.service';
import { CreateChildDto, UpdateChildDto, ChildResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('kids')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('kids')
export class KidsController {
  constructor(private kidsService: KidsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a child' })
  @ApiResponse({ status: 201, type: ChildResponseDto })
  async createChild(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateChildDto,
  ): Promise<ChildResponseDto> {
    return this.kidsService.createChild(user.householdId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all children' })
  @ApiResponse({ status: 200, type: [ChildResponseDto] })
  async getChildren(@CurrentUser() user: JwtPayload): Promise<ChildResponseDto[]> {
    return this.kidsService.getChildren(user.householdId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a child by ID' })
  @ApiResponse({ status: 200, type: ChildResponseDto })
  async getChild(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<ChildResponseDto> {
    return this.kidsService.getChild(user.householdId!, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a child' })
  @ApiResponse({ status: 200, type: ChildResponseDto })
  async updateChild(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateChildDto,
  ): Promise<ChildResponseDto> {
    return this.kidsService.updateChild(user.householdId!, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a child' })
  @ApiResponse({ status: 200 })
  async deleteChild(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.kidsService.deleteChild(user.householdId!, id);
  }
}
