import { IsString, IsNumber, IsOptional } from 'class-validator';

export class BarcodeLookupDto {
  @IsString()
  barcode: string;
}

export class CreateBarcodeProductDto {
  @IsString()
  barcode: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  defaultPrice?: number;
}
