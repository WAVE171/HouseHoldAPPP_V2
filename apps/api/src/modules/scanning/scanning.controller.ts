import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { HouseholdGuard } from '../../common/guards/household.guard';
import { Household } from '../../common/decorators/household.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ScanningService } from './scanning.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { BarcodeLookupDto, CreateBarcodeProductDto } from './dto/barcode-lookup.dto';

@Controller('scanning')
@UseGuards(JwtAuthGuard, HouseholdGuard)
export class ScanningController {
  constructor(private readonly scanningService: ScanningService) {}

  // Receipt endpoints
  @Post('receipts')
  createReceipt(
    @Household('id') householdId: string,
    @Body() dto: CreateReceiptDto,
  ) {
    return this.scanningService.createReceipt(householdId, dto);
  }

  @Get('receipts')
  getReceipts(@Household('id') householdId: string) {
    return this.scanningService.getReceipts(householdId);
  }

  @Get('receipts/:id')
  getReceipt(
    @Household('id') householdId: string,
    @Param('id') id: string,
  ) {
    return this.scanningService.getReceiptById(householdId, id);
  }

  @Delete('receipts/:id')
  deleteReceipt(
    @Household('id') householdId: string,
    @Param('id') id: string,
  ) {
    return this.scanningService.deleteReceipt(householdId, id);
  }

  @Post('receipts/:id/link-transaction')
  linkReceiptToTransaction(
    @Household('id') householdId: string,
    @Param('id') receiptId: string,
    @Body('transactionId') transactionId: string,
  ) {
    return this.scanningService.linkReceiptToTransaction(
      householdId,
      receiptId,
      transactionId,
    );
  }

  @Post('receipts/:id/add-to-inventory')
  addReceiptItemsToInventory(
    @Household('id') householdId: string,
    @Param('id') receiptId: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.scanningService.addReceiptItemsToInventory(
      householdId,
      receiptId,
      categoryId,
    );
  }

  @Post('receipts/:id/create-transaction')
  createTransactionFromReceipt(
    @Household('id') householdId: string,
    @Param('id') receiptId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.scanningService.createTransactionFromReceipt(
      householdId,
      receiptId,
      userId,
    );
  }

  // Barcode endpoints
  @Post('barcode/lookup')
  lookupBarcode(@Body() dto: BarcodeLookupDto) {
    return this.scanningService.lookupBarcode(dto.barcode);
  }

  @Post('barcode/products')
  createBarcodeProduct(@Body() dto: CreateBarcodeProductDto) {
    return this.scanningService.createBarcodeProduct(dto);
  }
}
