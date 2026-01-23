// Stub file - API integration pending

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  paymentMethod?: string;
}

export interface Budget {
  id: string;
  name: string;
  period: string;
  totalBudgeted: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  category: string;
  isRecurring: boolean;
}

export const mockTransactions: Transaction[] = [];
export const mockBudgets: Budget[] = [];
export const mockBills: Bill[] = [];

export const expenseCategories = [
  'Food & Groceries',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other',
];

export const incomeCategories = [
  'Salary',
  'Business',
  'Investments',
  'Rental',
  'Other',
];

export async function getTransactions(): Promise<Transaction[]> {
  return [];
}

export async function createTransaction(_data: Partial<Transaction>): Promise<Transaction> {
  throw new Error('API integration required');
}

export async function updateTransaction(_id: string, _data: Partial<Transaction>): Promise<Transaction> {
  throw new Error('API integration required');
}

export async function deleteTransaction(_id: string): Promise<void> {
  return;
}

export async function getBudgets(): Promise<Budget[]> {
  return [];
}

export async function createBudget(_data: Partial<Budget>): Promise<Budget> {
  throw new Error('API integration required');
}

export async function getBills(): Promise<Bill[]> {
  return [];
}

export async function createBill(_data: Partial<Bill>): Promise<Bill> {
  throw new Error('API integration required');
}

export async function markBillPaid(_id: string): Promise<Bill> {
  throw new Error('API integration required');
}
