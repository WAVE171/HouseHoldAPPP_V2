import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  actionUrl?: string;
}

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  read?: boolean;
}

export class NotificationQueryDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  unreadOnly?: boolean;

  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  offset?: string;
}
