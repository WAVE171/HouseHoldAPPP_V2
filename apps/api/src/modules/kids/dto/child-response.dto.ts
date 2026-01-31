import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChildResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  nickname?: string;

  @ApiPropertyOptional()
  photo?: string;

  @ApiPropertyOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  gender?: string;

  @ApiPropertyOptional()
  bloodType?: string;

  @ApiProperty({ type: [String] })
  allergies: string[];

  @ApiProperty({ type: [String] })
  medicalConditions: string[];

  @ApiProperty()
  householdId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
