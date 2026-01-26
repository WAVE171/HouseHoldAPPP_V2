import { apiClient } from './client';

// Types
export interface ScannedReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  matchedInventoryId?: string;
  confidence?: number;
}

export interface ScannedReceipt {
  id: string;
  imageUrl?: string;
  storeName: string;
  storeAddress?: string;
  date: string;
  subtotal?: number;
  tax?: number;
  total: number;
  paymentMethod?: string;
  rawText?: string;
  confidence?: number;
  ocrService?: string;
  linkedTransactionId?: string;
  householdId: string;
  items: ScannedReceiptItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptItemData {
  name: string;
  quantity?: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  matchedInventoryId?: string;
  confidence?: number;
}

export interface CreateReceiptData {
  imageUrl?: string;
  storeName: string;
  storeAddress?: string;
  date: string;
  subtotal?: number;
  tax?: number;
  total: number;
  paymentMethod?: string;
  rawText?: string;
  confidence?: number;
  ocrService?: string;
  items: CreateReceiptItemData[];
}

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  defaultPrice?: number;
}

export interface CreateBarcodeProductData {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  defaultPrice?: number;
}

// API functions
export const scanningApi = {
  // Receipt operations
  createReceipt: async (data: CreateReceiptData): Promise<ScannedReceipt> => {
    const response = await apiClient.post('/scanning/receipts', data);
    return response.data;
  },

  getReceipts: async (): Promise<ScannedReceipt[]> => {
    const response = await apiClient.get('/scanning/receipts');
    return response.data;
  },

  getReceiptById: async (id: string): Promise<ScannedReceipt> => {
    const response = await apiClient.get(`/scanning/receipts/${id}`);
    return response.data;
  },

  deleteReceipt: async (id: string): Promise<void> => {
    await apiClient.delete(`/scanning/receipts/${id}`);
  },

  linkReceiptToTransaction: async (
    receiptId: string,
    transactionId: string,
  ): Promise<ScannedReceipt> => {
    const response = await apiClient.post(
      `/scanning/receipts/${receiptId}/link-transaction`,
      { transactionId },
    );
    return response.data;
  },

  addReceiptItemsToInventory: async (
    receiptId: string,
    categoryId: string,
  ): Promise<{ success: boolean; updatedCount: number }> => {
    const response = await apiClient.post(
      `/scanning/receipts/${receiptId}/add-to-inventory`,
      { categoryId },
    );
    return response.data;
  },

  createTransactionFromReceipt: async (
    receiptId: string,
  ): Promise<{ success: boolean; transactionId: string }> => {
    const response = await apiClient.post(
      `/scanning/receipts/${receiptId}/create-transaction`,
    );
    return response.data;
  },

  // Barcode operations
  lookupBarcode: async (barcode: string): Promise<BarcodeProduct | null> => {
    const response = await apiClient.post('/scanning/barcode/lookup', { barcode });
    return response.data;
  },

  createBarcodeProduct: async (data: CreateBarcodeProductData): Promise<BarcodeProduct> => {
    const response = await apiClient.post('/scanning/barcode/products', data);
    return response.data;
  },
};
