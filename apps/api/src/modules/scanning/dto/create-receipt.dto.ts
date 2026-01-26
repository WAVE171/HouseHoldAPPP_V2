import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReceiptItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  quantity?: number = 1;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  matchedInventoryId?: string;

  @IsNumber()
  @IsOptional()
  confidence?: number;
}

export class CreateReceiptDto {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  storeName: string;

  @IsString()
  @IsOptional()
  storeAddress?: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  rawText?: string;

  @IsNumber()
  @IsOptional()
  confidence?: number;

  @IsString()
  @IsOptional()
  ocrService?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceiptItemDto)
  items: CreateReceiptItemDto[];
}
