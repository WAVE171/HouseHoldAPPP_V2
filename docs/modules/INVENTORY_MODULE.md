# Inventory Module Documentation

## Overview

The Inventory module manages household inventory with support for hierarchical categories, stock tracking, expiration dates, low stock alerts, and stock history.

## Location

```
apps/api/src/modules/inventory/
├── dto/
│   ├── create-category.dto.ts
│   ├── create-item.dto.ts
│   └── update-item.dto.ts
├── inventory.controller.ts
├── inventory.service.ts
└── inventory.module.ts
```

## Endpoints

### Categories

#### POST `/api/v1/inventory/categories`

Create a new category.

**Request Body:**
```json
{
  "name": "Pantry",
  "icon": "package",
  "color": "#8B4513",
  "parentId": null
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Pantry",
    "icon": "package",
    "color": "#8B4513",
    "order": 0,
    "parentId": null,
    "householdId": "clx...",
    "itemCount": 0,
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/inventory/categories`

Get all categories.

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Pantry",
      "icon": "package",
      "color": "#8B4513",
      "order": 0,
      "itemCount": 15,
      "householdId": "clx...",
      "createdAt": "2026-01-26T00:00:00.000Z"
    },
    {
      "id": "clx...",
      "name": "Refrigerator",
      "icon": "snowflake",
      "color": "#4169E1",
      "order": 1,
      "itemCount": 23,
      "householdId": "clx...",
      "createdAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

#### DELETE `/api/v1/inventory/categories/:id`

Delete a category (items must be moved first).

### Items

#### POST `/api/v1/inventory/items`

Create a new inventory item.

**Request Body:**
```json
{
  "name": "Olive Oil",
  "description": "Extra virgin olive oil",
  "quantity": 2,
  "unit": "bottles",
  "location": "Top shelf",
  "categoryId": "clx...",
  "lowStockThreshold": 1,
  "expiryDate": "2027-06-15",
  "barcode": "8001234567890",
  "purchasePrice": 12.99
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Olive Oil",
    "description": "Extra virgin olive oil",
    "quantity": 2,
    "unit": "bottles",
    "location": "Top shelf",
    "categoryId": "clx...",
    "lowStockThreshold": 1,
    "expiryDate": "2027-06-15",
    "barcode": "8001234567890",
    "purchasePrice": 12.99,
    "onShoppingList": false,
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/inventory/items`

Get all inventory items.

**Query Parameters:**
- `categoryId` - Filter by category
- `lowStock` - Filter items below threshold
- `expiringSoon` - Filter items expiring within days

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Olive Oil",
      "quantity": 2,
      "unit": "bottles",
      "location": "Top shelf",
      "categoryId": "clx...",
      "lowStockThreshold": 1,
      "expiryDate": "2027-06-15",
      "updatedAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/v1/inventory/items/:id`

Get a specific item with stock history.

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Olive Oil",
    "quantity": 2,
    "unit": "bottles",
    "stockHistory": [
      {
        "id": "clx...",
        "quantityChange": 2,
        "reason": "Initial stock",
        "createdAt": "2026-01-26T00:00:00.000Z"
      }
    ]
  }
}
```

#### PATCH `/api/v1/inventory/items/:id`

Update an item (including stock adjustment).

**Request Body:**
```json
{
  "quantity": 1,
  "stockChangeReason": "Used 1 bottle"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Olive Oil",
    "quantity": 1,
    "updatedAt": "2026-01-27T00:00:00.000Z"
  }
}
```

#### DELETE `/api/v1/inventory/items/:id`

Delete an inventory item.

## Data Models

### InventoryCategory

```typescript
interface InventoryCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
  parentId?: string;
  householdId: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### InventoryItem

```typescript
interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  location?: string;
  categoryId: string;
  householdId: string;
  purchaseDate?: string;
  purchasePrice?: number;
  expiryDate?: string;
  lowStockThreshold?: number;
  barcode?: string;
  sku?: string;
  photos: string[];
  onShoppingList: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### StockHistory

```typescript
interface StockHistory {
  id: string;
  itemId: string;
  quantityChange: number;
  reason?: string;
  notes?: string;
  createdAt: string;
}
```

## Service Methods

```typescript
class InventoryService {
  // Categories
  async createCategory(householdId: string, dto: CreateCategoryDto): Promise<Category>
  async getCategories(householdId: string): Promise<Category[]>
  async deleteCategory(householdId: string, id: string): Promise<void>

  // Items
  async createItem(householdId: string, dto: CreateItemDto): Promise<Item>
  async getItems(householdId: string, filters?: ItemFilters): Promise<Item[]>
  async getItemById(householdId: string, id: string): Promise<Item>
  async updateItem(householdId: string, id: string, dto: UpdateItemDto): Promise<Item>
  async deleteItem(householdId: string, id: string): Promise<void>

  // Stock management
  async updateStock(householdId: string, itemId: string, change: number, reason?: string): Promise<Item>
}
```

## Frontend Integration

```typescript
// src/shared/api/inventory.api.ts
export const inventoryApi = {
  // Categories
  getCategories: async () => {
    const response = await apiClient.get('/inventory/categories');
    return response.data;
  },

  createCategory: async (data: CreateCategoryData) => {
    const response = await apiClient.post('/inventory/categories', data);
    return response.data;
  },

  // Items
  getItems: async () => {
    const response = await apiClient.get('/inventory/items');
    return response.data;
  },

  createItem: async (data: CreateItemData) => {
    const response = await apiClient.post('/inventory/items', data);
    return response.data;
  },

  updateStock: async (itemId: string, change: number, reason?: string) => {
    const response = await apiClient.patch(`/inventory/items/${itemId}`, {
      quantityChange: change,
      stockChangeReason: reason
    });
    return response.data;
  },

  deleteItem: async (id: string) => {
    await apiClient.delete(`/inventory/items/${id}`);
  }
};
```

## Default Categories

The database seed creates these default categories:
- Pantry (icon: package, color: #8B4513)
- Refrigerator (icon: snowflake, color: #4169E1)
- Freezer (icon: thermometer, color: #00CED1)
- Cleaning (icon: spray, color: #32CD32)
- Bathroom (icon: bath, color: #9370DB)

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Item or category not found |
| 409 | Conflict | Category has items (cannot delete) |
