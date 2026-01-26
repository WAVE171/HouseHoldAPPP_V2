# Scanning Module Documentation

## Overview

The Scanning module provides receipt scanning and barcode lookup functionality, integrating with the Finance and Inventory modules to automatically create transactions and inventory items from scanned data.

## Location

```
apps/api/src/modules/scanning/
├── dto/
│   ├── create-receipt.dto.ts
│   └── barcode-lookup.dto.ts
├── scanning.controller.ts
├── scanning.service.ts
└── scanning.module.ts
```

## Endpoints

### Receipt Operations

#### POST `/api/v1/scanning/receipts`

Create a new scanned receipt.

**Request Body:**
```json
{
  "imageUrl": "https://storage.example.com/receipt.jpg",
  "storeName": "Supermarket",
  "storeAddress": "123 Main St",
  "date": "2026-01-26T00:00:00.000Z",
  "subtotal": 45.50,
  "tax": 4.55,
  "total": 50.05,
  "paymentMethod": "Credit Card",
  "rawText": "Raw OCR text...",
  "confidence": 0.95,
  "ocrService": "Google Vision",
  "items": [
    {
      "name": "Milk",
      "quantity": 2,
      "unitPrice": 3.50,
      "totalPrice": 7.00,
      "category": "Dairy",
      "confidence": 0.98
    },
    {
      "name": "Bread",
      "quantity": 1,
      "unitPrice": 2.50,
      "totalPrice": 2.50,
      "category": "Bakery",
      "confidence": 0.92
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "imageUrl": "https://storage.example.com/receipt.jpg",
    "storeName": "Supermarket",
    "storeAddress": "123 Main St",
    "date": "2026-01-26T00:00:00.000Z",
    "subtotal": 45.50,
    "tax": 4.55,
    "total": 50.05,
    "paymentMethod": "Credit Card",
    "confidence": 0.95,
    "ocrService": "Google Vision",
    "linkedTransactionId": null,
    "householdId": "clx...",
    "items": [
      {
        "id": "clx...",
        "name": "Milk",
        "quantity": 2,
        "unitPrice": 3.50,
        "totalPrice": 7.00,
        "category": "Dairy",
        "confidence": 0.98
      }
    ],
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/scanning/receipts`

Get all scanned receipts for the household.

#### GET `/api/v1/scanning/receipts/:id`

Get a specific receipt with items.

#### DELETE `/api/v1/scanning/receipts/:id`

Delete a scanned receipt.

#### POST `/api/v1/scanning/receipts/:id/link-transaction`

Link a receipt to an existing transaction.

**Request Body:**
```json
{
  "transactionId": "clx..."
}
```

#### POST `/api/v1/scanning/receipts/:id/add-to-inventory`

Add receipt items to inventory.

**Request Body:**
```json
{
  "categoryId": "clx..."
}
```

**Response:**
```json
{
  "data": {
    "success": true,
    "updatedCount": 5,
    "items": [...]
  }
}
```

#### POST `/api/v1/scanning/receipts/:id/create-transaction`

Automatically create a finance transaction from the receipt.

**Response:**
```json
{
  "data": {
    "success": true,
    "transactionId": "clx...",
    "transaction": {
      "id": "clx...",
      "type": "EXPENSE",
      "amount": 50.05,
      "category": "Shopping",
      "description": "Receipt from Supermarket"
    }
  }
}
```

### Barcode Operations

#### POST `/api/v1/scanning/barcode/lookup`

Look up product information by barcode.

**Request Body:**
```json
{
  "barcode": "8001234567890"
}
```

**Response:**
```json
{
  "data": {
    "barcode": "8001234567890",
    "name": "Olive Oil Extra Virgin",
    "brand": "Brand Name",
    "category": "Pantry",
    "imageUrl": "https://example.com/product.jpg",
    "defaultPrice": 12.99
  }
}
```

#### POST `/api/v1/scanning/barcode/products`

Create or update a barcode product entry.

**Request Body:**
```json
{
  "barcode": "8001234567890",
  "name": "Olive Oil Extra Virgin",
  "brand": "Brand Name",
  "category": "Pantry",
  "imageUrl": "https://example.com/product.jpg",
  "defaultPrice": 12.99
}
```

## Data Models

### ScannedReceipt

```typescript
interface ScannedReceipt {
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
```

### ScannedReceiptItem

```typescript
interface ScannedReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  matchedInventoryId?: string;
  confidence?: number;
}
```

### BarcodeProduct

```typescript
interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  defaultPrice?: number;
}
```

## Service Methods

```typescript
class ScanningService {
  // Receipt operations
  async createReceipt(householdId: string, dto: CreateReceiptDto): Promise<ScannedReceipt>
  async getReceipts(householdId: string): Promise<ScannedReceipt[]>
  async getReceiptById(householdId: string, id: string): Promise<ScannedReceipt>
  async deleteReceipt(householdId: string, id: string): Promise<void>
  async linkReceiptToTransaction(householdId: string, receiptId: string, transactionId: string): Promise<ScannedReceipt>
  async addReceiptItemsToInventory(householdId: string, receiptId: string, categoryId: string): Promise<{ success: boolean; updatedCount: number }>
  async createTransactionFromReceipt(householdId: string, receiptId: string, userId: string): Promise<{ success: boolean; transactionId: string }>

  // Barcode operations
  async lookupBarcode(barcode: string): Promise<BarcodeProduct | null>
  async createBarcodeProduct(dto: CreateBarcodeProductDto): Promise<BarcodeProduct>
}
```

## Frontend Integration

```typescript
// src/shared/api/scanning.api.ts
export const scanningApi = {
  // Receipt operations
  createReceipt: async (data: CreateReceiptData) => {
    const response = await apiClient.post('/scanning/receipts', data);
    return response.data;
  },

  getReceipts: async () => {
    const response = await apiClient.get('/scanning/receipts');
    return response.data;
  },

  getReceiptById: async (id: string) => {
    const response = await apiClient.get(`/scanning/receipts/${id}`);
    return response.data;
  },

  deleteReceipt: async (id: string) => {
    await apiClient.delete(`/scanning/receipts/${id}`);
  },

  linkReceiptToTransaction: async (receiptId: string, transactionId: string) => {
    const response = await apiClient.post(
      `/scanning/receipts/${receiptId}/link-transaction`,
      { transactionId }
    );
    return response.data;
  },

  addReceiptItemsToInventory: async (receiptId: string, categoryId: string) => {
    const response = await apiClient.post(
      `/scanning/receipts/${receiptId}/add-to-inventory`,
      { categoryId }
    );
    return response.data;
  },

  createTransactionFromReceipt: async (receiptId: string) => {
    const response = await apiClient.post(
      `/scanning/receipts/${receiptId}/create-transaction`
    );
    return response.data;
  },

  // Barcode operations
  lookupBarcode: async (barcode: string) => {
    const response = await apiClient.post('/scanning/barcode/lookup', { barcode });
    return response.data;
  },

  createBarcodeProduct: async (data: CreateBarcodeProductData) => {
    const response = await apiClient.post('/scanning/barcode/products', data);
    return response.data;
  }
};
```

## Integration with Other Modules

### Finance Module Integration

When `createTransactionFromReceipt` is called:
1. Creates an EXPENSE transaction with the receipt total
2. Sets category to "Shopping"
3. Links the receipt image as receiptUrl
4. Updates the receipt with linkedTransactionId

### Inventory Module Integration

When `addReceiptItemsToInventory` is called:
1. Creates inventory items for each receipt item
2. Sets purchasePrice and purchaseDate from receipt
3. All items are added to the specified category

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Receipt not found |
