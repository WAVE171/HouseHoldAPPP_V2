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
  isRecurring?: boolean;
  notes?: string;
  createdBy?: string;
  householdId?: string;
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
  balance: number;
  budgetRemaining: number;
  upcomingBills: number;
}
