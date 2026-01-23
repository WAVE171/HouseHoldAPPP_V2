// Stub file - API integration pending

export interface InventoryCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  itemCount: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  categoryId: string;
  category?: string;
  location?: string;
  purchasePrice?: number;
  expiryDate?: string;
  lowStockThreshold?: number;
  barcode?: string;
  onShoppingList?: boolean;
}

export const mockCategories: InventoryCategory[] = [];
export const mockItems: InventoryItem[] = [];

export async function getCategories(): Promise<InventoryCategory[]> {
  return [];
}

export async function createCategory(_data: Partial<InventoryCategory>): Promise<InventoryCategory> {
  throw new Error('API integration required');
}

export async function updateCategory(_id: string, _data: Partial<InventoryCategory>): Promise<InventoryCategory> {
  throw new Error('API integration required');
}

export async function deleteCategory(_id: string): Promise<void> {
  return;
}

export async function getItems(_categoryId?: string): Promise<InventoryItem[]> {
  return [];
}

export async function createItem(_data: Partial<InventoryItem>): Promise<InventoryItem> {
  throw new Error('API integration required');
}

export async function updateItem(_id: string, _data: Partial<InventoryItem>): Promise<InventoryItem> {
  throw new Error('API integration required');
}

export async function deleteItem(_id: string): Promise<void> {
  return;
}

export async function updateItemQuantity(_id: string, _change: number): Promise<InventoryItem> {
  throw new Error('API integration required');
}

export async function addToShoppingList(_id: string): Promise<void> {
  return;
}

export async function removeFromShoppingList(_id: string): Promise<void> {
  return;
}
