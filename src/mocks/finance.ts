export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod?: string;
  recurring?: boolean;
  notes?: string;
  createdBy: string;
  householdId: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
  isRecurring: boolean;
  recurrenceFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  autoPay: boolean;
  paymentMethod?: string;
  notes?: string;
  householdId: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  totalBudget: number;
  totalSpent: number;
  savingsRate: number;
  upcomingBills: number;
}

export const mockBudgetCategories: BudgetCategory[] = [
  { id: '1', name: 'Housing', icon: 'Home', budget: 2500, spent: 2500, color: '#3b82f6' },
  { id: '2', name: 'Utilities', icon: 'Zap', budget: 400, spent: 350, color: '#f59e0b' },
  { id: '3', name: 'Groceries', icon: 'ShoppingCart', budget: 800, spent: 650, color: '#10b981' },
  { id: '4', name: 'Transportation', icon: 'Car', budget: 500, spent: 420, color: '#8b5cf6' },
  { id: '5', name: 'Entertainment', icon: 'Tv', budget: 300, spent: 280, color: '#ec4899' },
  { id: '6', name: 'Healthcare', icon: 'Heart', budget: 200, spent: 150, color: '#ef4444' },
  { id: '7', name: 'Education', icon: 'GraduationCap', budget: 400, spent: 200, color: '#06b6d4' },
  { id: '8', name: 'Personal', icon: 'User', budget: 250, spent: 180, color: '#6366f1' },
];

const today = new Date();
const getDate = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Mortgage Payment',
    amount: 2500,
    type: 'expense',
    category: 'Housing',
    date: getDate(-1),
    paymentMethod: 'Bank Transfer',
    recurring: true,
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '2',
    description: 'Salary - John',
    amount: 5500,
    type: 'income',
    category: 'Income',
    date: getDate(-3),
    paymentMethod: 'Direct Deposit',
    recurring: true,
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '3',
    description: 'Whole Foods',
    amount: 185.50,
    type: 'expense',
    category: 'Groceries',
    date: getDate(-2),
    paymentMethod: 'Credit Card',
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '4',
    description: 'Electric Bill',
    amount: 145.00,
    type: 'expense',
    category: 'Utilities',
    date: getDate(-5),
    paymentMethod: 'Auto Pay',
    recurring: true,
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '5',
    description: 'Gas Station',
    amount: 65.00,
    type: 'expense',
    category: 'Transportation',
    date: getDate(-1),
    paymentMethod: 'Credit Card',
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '6',
    description: 'Salary - Sarah',
    amount: 4200,
    type: 'income',
    category: 'Income',
    date: getDate(-3),
    paymentMethod: 'Direct Deposit',
    recurring: true,
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '7',
    description: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    category: 'Entertainment',
    date: getDate(-7),
    paymentMethod: 'Credit Card',
    recurring: true,
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '8',
    description: 'Costco Shopping',
    amount: 245.30,
    type: 'expense',
    category: 'Groceries',
    date: getDate(-4),
    paymentMethod: 'Debit Card',
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '9',
    description: 'Kids Soccer Registration',
    amount: 150.00,
    type: 'expense',
    category: 'Education',
    date: getDate(-10),
    paymentMethod: 'Credit Card',
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '10',
    description: 'Water Bill',
    amount: 75.00,
    type: 'expense',
    category: 'Utilities',
    date: getDate(-8),
    paymentMethod: 'Auto Pay',
    recurring: true,
    createdBy: 'John Smith',
    householdId: '1',
  },
];

export const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Mortgage',
    amount: 2500,
    dueDate: getDate(5),
    category: 'Housing',
    isPaid: false,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    autoPay: true,
    paymentMethod: 'Bank Transfer',
    householdId: '1',
  },
  {
    id: '2',
    name: 'Electric Bill',
    amount: 150,
    dueDate: getDate(10),
    category: 'Utilities',
    isPaid: false,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    autoPay: true,
    householdId: '1',
  },
  {
    id: '3',
    name: 'Internet',
    amount: 79.99,
    dueDate: getDate(3),
    category: 'Utilities',
    isPaid: false,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    autoPay: false,
    householdId: '1',
  },
  {
    id: '4',
    name: 'Car Insurance',
    amount: 180,
    dueDate: getDate(15),
    category: 'Transportation',
    isPaid: false,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    autoPay: true,
    householdId: '1',
  },
  {
    id: '5',
    name: 'Water Bill',
    amount: 75,
    dueDate: getDate(-2),
    category: 'Utilities',
    isPaid: true,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    autoPay: true,
    householdId: '1',
  },
  {
    id: '6',
    name: 'Phone Plan',
    amount: 120,
    dueDate: getDate(8),
    category: 'Utilities',
    isPaid: false,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    autoPay: false,
    householdId: '1',
  },
  {
    id: '7',
    name: 'Property Tax',
    amount: 1200,
    dueDate: getDate(45),
    category: 'Housing',
    isPaid: false,
    isRecurring: true,
    recurrenceFrequency: 'quarterly',
    autoPay: false,
    householdId: '1',
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getBudgetCategories(): Promise<BudgetCategory[]> {
  await delay(300);
  return mockBudgetCategories;
}

export async function getTransactions(): Promise<Transaction[]> {
  await delay(300);
  return mockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBills(): Promise<Bill[]> {
  await delay(300);
  return mockBills.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
  await delay(300);
  const income = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBudget = mockBudgetCategories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = mockBudgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const upcomingBills = mockBills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    totalBudget,
    totalSpent,
    savingsRate: ((income - expenses) / income) * 100,
    upcomingBills,
  };
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  await delay(500);
  const newTransaction: Transaction = {
    ...transaction,
    id: String(mockTransactions.length + 1),
  };
  mockTransactions.push(newTransaction);
  return newTransaction;
}

export async function updateBudget(categoryId: string, budget: number): Promise<BudgetCategory> {
  await delay(300);
  const category = mockBudgetCategories.find(c => c.id === categoryId);
  if (!category) throw new Error('Category not found');
  category.budget = budget;
  return category;
}

export async function markBillAsPaid(billId: string): Promise<Bill> {
  await delay(300);
  const bill = mockBills.find(b => b.id === billId);
  if (!bill) throw new Error('Bill not found');
  bill.isPaid = true;
  return bill;
}

export async function addBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
  await delay(500);
  const newBill: Bill = {
    ...bill,
    id: String(mockBills.length + 1),
  };
  mockBills.push(newBill);
  return newBill;
}
