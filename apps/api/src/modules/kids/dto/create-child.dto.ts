import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MaxLength, IsArray } from 'class-validator';

export class CreateChildDto {
  @ApiProperty({ description: 'First name' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ description: 'Nickname' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @ApiPropertyOptional({ description: 'Photo URL or base64 string' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({ description: 'Date of birth (ISO format)' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Gender', enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Blood type' })
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiPropertyOptional({ description: 'List of allergies', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @ApiPropertyOptional({ description: 'List of medical conditions', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicalConditions?: string[];
}
