import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateBarcodeProductDto } from './dto/barcode-lookup.dto';

@Injectable()
export class ScanningService {
  constructor(private prisma: PrismaService) {}

  // Receipt operations
  async createReceipt(householdId: string, dto: CreateReceiptDto) {
    const receipt = await this.prisma.scannedReceipt.create({
      data: {
        imageUrl: dto.imageUrl,
        storeName: dto.storeName,
        storeAddress: dto.storeAddress,
        date: new Date(dto.date),
        subtotal: dto.subtotal,
        tax: dto.tax,
        total: dto.total,
        paymentMethod: dto.paymentMethod,
        rawText: dto.rawText,
        confidence: dto.confidence,
        ocrService: dto.ocrService,
        householdId,
        items: {
          create: dto.items.map((item) => ({
            name: item.name,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            category: item.category,
            matchedInventoryId: item.matchedInventoryId,
            confidence: item.confidence,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapReceipt(receipt);
  }

  async getReceipts(householdId: string) {
    const receipts = await this.prisma.scannedReceipt.findMany({
      where: { householdId },
      include: { items: true },
      orderBy: { date: 'desc' },
    });

    return receipts.map((r) => this.mapReceipt(r));
  }

  async getReceiptById(householdId: string, id: string) {
    const receipt = await this.prisma.scannedReceipt.findFirst({
      where: { id, householdId },
      include: { items: true },
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    return this.mapReceipt(receipt);
  }

  async deleteReceipt(householdId: string, id: string) {
    const receipt = await this.prisma.scannedReceipt.findFirst({
      where: { id, householdId },
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    await this.prisma.scannedReceipt.delete({ where: { id } });
  }

  async linkReceiptToTransaction(
    householdId: string,
    receiptId: string,
    transactionId: string,
  ) {
    const receipt = await this.prisma.scannedReceipt.findFirst({
      where: { id: receiptId, householdId },
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    const updated = await this.prisma.scannedReceipt.update({
      where: { id: receiptId },
      data: { linkedTransactionId: transactionId },
      include: { items: true },
    });

    return this.mapReceipt(updated);
  }

  // Barcode operations
  async lookupBarcode(barcode: string) {
    const product = await this.prisma.barcodeProduct.findUnique({
      where: { barcode },
    });

    if (!product) {
      return null;
    }

    return {
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      defaultPrice: product.defaultPrice,
    };
  }

  async createBarcodeProduct(dto: CreateBarcodeProductDto) {
    const product = await this.prisma.barcodeProduct.upsert({
      where: { barcode: dto.barcode },
      update: {
        name: dto.name,
        brand: dto.brand,
        category: dto.category,
        imageUrl: dto.imageUrl,
        defaultPrice: dto.defaultPrice,
      },
      create: {
        barcode: dto.barcode,
        name: dto.name,
        brand: dto.brand,
        category: dto.category,
        imageUrl: dto.imageUrl,
        defaultPrice: dto.defaultPrice,
      },
    });

    return {
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      defaultPrice: product.defaultPrice,
    };
  }

  // Add receipt items to inventory
  async addReceiptItemsToInventory(
    householdId: string,
    receiptId: string,
    categoryId: string,
  ) {
    const receipt = await this.prisma.scannedReceipt.findFirst({
      where: { id: receiptId, householdId },
      include: { items: true },
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    const createdItems: any[] = [];
    for (const item of receipt.items) {
      const inventoryItem = await this.prisma.inventoryItem.create({
        data: {
          name: item.name,
          quantity: item.quantity,
          unit: 'unit',
          purchasePrice: item.unitPrice,
          purchaseDate: receipt.date,
          categoryId,
          householdId,
        },
      });
      createdItems.push(inventoryItem);
    }

    return {
      success: true,
      updatedCount: createdItems.length,
      items: createdItems,
    };
  }

  // Create transaction from receipt
  async createTransactionFromReceipt(
    householdId: string,
    receiptId: string,
    userId: string,
  ) {
    const receipt = await this.prisma.scannedReceipt.findFirst({
      where: { id: receiptId, householdId },
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        amount: receipt.total,
        category: 'Shopping',
        description: `Receipt from ${receipt.storeName}`,
        date: receipt.date,
        paymentMethod: receipt.paymentMethod,
        receiptUrl: receipt.imageUrl,
        creatorId: userId,
        householdId,
      },
    });

    // Link receipt to transaction
    await this.prisma.scannedReceipt.update({
      where: { id: receiptId },
      data: { linkedTransactionId: transaction.id },
    });

    return {
      success: true,
      transactionId: transaction.id,
      transaction,
    };
  }

  private mapReceipt(receipt: any) {
    return {
      id: receipt.id,
      imageUrl: receipt.imageUrl,
      storeName: receipt.storeName,
      storeAddress: receipt.storeAddress,
      date: receipt.date.toISOString(),
      subtotal: receipt.subtotal,
      tax: receipt.tax,
      total: receipt.total,
      paymentMethod: receipt.paymentMethod,
      rawText: receipt.rawText,
      confidence: receipt.confidence,
      ocrService: receipt.ocrService,
      linkedTransactionId: receipt.linkedTransactionId,
      householdId: receipt.householdId,
      items: receipt.items?.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        category: item.category,
        matchedInventoryId: item.matchedInventoryId,
        confidence: item.confidence,
      })) || [],
      createdAt: receipt.createdAt.toISOString(),
      updatedAt: receipt.updatedAt.toISOString(),
    };
  }
}
