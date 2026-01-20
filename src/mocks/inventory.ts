export interface InventoryCategory {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  color: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  location: string;
  expirationDate?: string;
  purchaseDate?: string;
  price?: number;
  barcode?: string;
  notes?: string;
  householdId: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isPurchased: boolean;
  addedBy: string;
  addedAt: string;
}

export const mockCategories: InventoryCategory[] = [
  { id: '1', name: 'Pantry', icon: 'UtensilsCrossed', itemCount: 24, color: '#f59e0b' },
  { id: '2', name: 'Refrigerator', icon: 'Refrigerator', itemCount: 18, color: '#3b82f6' },
  { id: '3', name: 'Freezer', icon: 'Snowflake', itemCount: 12, color: '#06b6d4' },
  { id: '4', name: 'Cleaning', icon: 'Sparkles', itemCount: 8, color: '#10b981' },
  { id: '5', name: 'Bathroom', icon: 'Bath', itemCount: 15, color: '#8b5cf6' },
  { id: '6', name: 'Medicine', icon: 'Pill', itemCount: 6, color: '#ef4444' },
];

export const mockItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Leite',
    category: 'Refrigerator',
    quantity: 2,
    unit: 'L',
    minQuantity: 1,
    location: 'Prateleira superior',
    expirationDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    price: 450,
    householdId: '1',
  },
  {
    id: '2',
    name: 'Ovos',
    category: 'Refrigerator',
    quantity: 18,
    unit: 'unidades',
    minQuantity: 6,
    location: 'Porta',
    expirationDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    price: 800,
    householdId: '1',
  },
  {
    id: '3',
    name: 'Pão',
    category: 'Pantry',
    quantity: 1,
    unit: 'unidades',
    minQuantity: 1,
    location: 'Bancada',
    expirationDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    price: 250,
    householdId: '1',
  },
  {
    id: '4',
    name: 'Arroz',
    category: 'Pantry',
    quantity: 3,
    unit: 'kg',
    minQuantity: 2,
    location: 'Armário A',
    price: 1200,
    householdId: '1',
  },
  {
    id: '5',
    name: 'Massa',
    category: 'Pantry',
    quantity: 4,
    unit: 'caixas',
    minQuantity: 2,
    location: 'Armário A',
    price: 350,
    householdId: '1',
  },
  {
    id: '6',
    name: 'Peito de Frango',
    category: 'Freezer',
    quantity: 2,
    unit: 'kg',
    minQuantity: 1,
    location: 'Gaveta superior',
    expirationDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    price: 2500,
    householdId: '1',
  },
  {
    id: '7',
    name: 'Pizza Congelada',
    category: 'Freezer',
    quantity: 3,
    unit: 'unidades',
    minQuantity: 2,
    location: 'Prateleira do meio',
    expirationDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    price: 1800,
    householdId: '1',
  },
  {
    id: '8',
    name: 'Detergente',
    category: 'Cleaning',
    quantity: 1,
    unit: 'garrafas',
    minQuantity: 1,
    location: 'Debaixo da pia',
    price: 600,
    householdId: '1',
  },
  {
    id: '9',
    name: 'Papel Toalha',
    category: 'Cleaning',
    quantity: 6,
    unit: 'rolos',
    minQuantity: 4,
    location: 'Armário de utilidades',
    price: 1500,
    householdId: '1',
  },
  {
    id: '10',
    name: 'Pasta de Dentes',
    category: 'Bathroom',
    quantity: 2,
    unit: 'tubos',
    minQuantity: 1,
    location: 'Armário do banheiro',
    price: 700,
    householdId: '1',
  },
  {
    id: '11',
    name: 'Shampoo',
    category: 'Bathroom',
    quantity: 1,
    unit: 'garrafas',
    minQuantity: 1,
    location: 'Chuveiro',
    price: 1200,
    householdId: '1',
  },
  {
    id: '12',
    name: 'Ibuprofeno',
    category: 'Medicine',
    quantity: 45,
    unit: 'comprimidos',
    minQuantity: 20,
    location: 'Armário de remédios',
    expirationDate: new Date(Date.now() + 86400000 * 365).toISOString(),
    price: 1500,
    householdId: '1',
  },
  {
    id: '13',
    name: 'Manteiga',
    category: 'Refrigerator',
    quantity: 1,
    unit: 'g',
    minQuantity: 1,
    location: 'Porta',
    expirationDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    price: 900,
    householdId: '1',
  },
  {
    id: '14',
    name: 'Queijo',
    category: 'Refrigerator',
    quantity: 0,
    unit: 'unidades',
    minQuantity: 1,
    location: 'Gaveta',
    price: 1200,
    householdId: '1',
  },
  {
    id: '15',
    name: 'Sumo de Laranja',
    category: 'Refrigerator',
    quantity: 1,
    unit: 'L',
    minQuantity: 1,
    location: 'Prateleira superior',
    expirationDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    price: 650,
    householdId: '1',
  },
];

export const mockShoppingList: ShoppingListItem[] = [
  {
    id: '1',
    name: 'Queijo',
    quantity: 2,
    unit: 'unidades',
    category: 'Refrigerator',
    isPurchased: false,
    addedBy: 'Maria Silva',
    addedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'Café',
    quantity: 1,
    unit: 'sacos',
    category: 'Pantry',
    isPurchased: false,
    addedBy: 'João Silva',
    addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '3',
    name: 'Detergente para Roupa',
    quantity: 1,
    unit: 'garrafas',
    category: 'Cleaning',
    isPurchased: true,
    addedBy: 'Maria Silva',
    addedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '4',
    name: 'Bananas',
    quantity: 1,
    unit: 'kg',
    category: 'Pantry',
    isPurchased: false,
    addedBy: 'Tomás Silva',
    addedAt: new Date().toISOString(),
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCategories(): Promise<InventoryCategory[]> {
  await delay(300);
  return mockCategories;
}

export async function getItems(): Promise<InventoryItem[]> {
  await delay(300);
  return mockItems;
}

export async function getItemsByCategory(category: string): Promise<InventoryItem[]> {
  await delay(300);
  return mockItems.filter(item => item.category === category);
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  await delay(300);
  return mockItems.filter(item => item.quantity <= item.minQuantity);
}

export async function getShoppingList(): Promise<ShoppingListItem[]> {
  await delay(300);
  return mockShoppingList;
}

export async function addItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  await delay(500);
  const newItem: InventoryItem = {
    ...item,
    id: String(mockItems.length + 1),
  };
  mockItems.push(newItem);
  return newItem;
}

export async function updateItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
  await delay(300);
  const index = mockItems.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Item not found');
  mockItems[index] = { ...mockItems[index], ...updates };
  return mockItems[index];
}

export async function deleteItem(id: string): Promise<void> {
  await delay(300);
  const index = mockItems.findIndex(i => i.id === id);
  if (index !== -1) {
    mockItems.splice(index, 1);
  }
}

export async function addToShoppingList(item: Omit<ShoppingListItem, 'id' | 'addedAt'>): Promise<ShoppingListItem> {
  await delay(500);
  const newItem: ShoppingListItem = {
    ...item,
    id: String(mockShoppingList.length + 1),
    addedAt: new Date().toISOString(),
  };
  mockShoppingList.push(newItem);
  return newItem;
}

export async function toggleShoppingItem(id: string): Promise<ShoppingListItem> {
  await delay(300);
  const item = mockShoppingList.find(i => i.id === id);
  if (!item) throw new Error('Item not found');
  item.isPurchased = !item.isPurchased;
  return item;
}

export async function removeFromShoppingList(id: string): Promise<void> {
  await delay(300);
  const index = mockShoppingList.findIndex(i => i.id === id);
  if (index !== -1) {
    mockShoppingList.splice(index, 1);
  }
}
