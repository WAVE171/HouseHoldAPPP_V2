# Finance Module Documentation

## Overview

The Finance module manages household finances including transactions (income/expenses), budgets with categories, bills tracking, and financial summaries.

## Location

```
apps/api/src/modules/finance/
├── dto/
│   ├── create-transaction.dto.ts
│   ├── create-budget.dto.ts
│   └── update-transaction.dto.ts
├── finance.controller.ts
├── finance.service.ts
└── finance.module.ts
```

## Endpoints

### Transactions

#### POST `/api/v1/finance/transactions`

Create a new transaction.

**Request Body:**
```json
{
  "type": "EXPENSE",
  "amount": 125.50,
  "category": "Groceries",
  "description": "Weekly grocery shopping",
  "date": "2026-01-26T00:00:00.000Z",
  "paymentMethod": "Credit Card",
  "isRecurring": false
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "type": "EXPENSE",
    "amount": 125.50,
    "category": "Groceries",
    "description": "Weekly grocery shopping",
    "date": "2026-01-26T00:00:00.000Z",
    "paymentMethod": "Credit Card",
    "isRecurring": false,
    "creatorId": "clx...",
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/finance/transactions`

Get all transactions.

**Query Parameters:**
- `type` - Filter by INCOME or EXPENSE
- `category` - Filter by category
- `startDate` - Filter from date
- `endDate` - Filter to date

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "type": "EXPENSE",
      "amount": 125.50,
      "category": "Groceries",
      "description": "Weekly grocery shopping",
      "date": "2026-01-26T00:00:00.000Z",
      "paymentMethod": "Credit Card",
      "createdAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/v1/finance/transactions/:id`

Get a specific transaction.

#### PATCH `/api/v1/finance/transactions/:id`

Update a transaction.

#### DELETE `/api/v1/finance/transactions/:id`

Delete a transaction.

### Budgets

#### POST `/api/v1/finance/budgets`

Create a new budget.

**Request Body:**
```json
{
  "name": "January 2026 Budget",
  "period": "MONTHLY",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-01-31T23:59:59.999Z",
  "totalBudgeted": 5000,
  "categories": [
    { "name": "Groceries", "budgeted": 800 },
    { "name": "Utilities", "budgeted": 400 },
    { "name": "Entertainment", "budgeted": 300 }
  ]
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "January 2026 Budget",
    "period": "MONTHLY",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-01-31T23:59:59.999Z",
    "totalBudgeted": 5000,
    "categories": [
      { "id": "clx...", "name": "Groceries", "budgeted": 800, "spent": 0 },
      { "id": "clx...", "name": "Utilities", "budgeted": 400, "spent": 0 },
      { "id": "clx...", "name": "Entertainment", "budgeted": 300, "spent": 0 }
    ],
    "creatorId": "clx...",
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/finance/budgets`

Get all budgets.

#### GET `/api/v1/finance/budgets/:id`

Get a specific budget with category spending.

#### DELETE `/api/v1/finance/budgets/:id`

Delete a budget.

### Summary

#### GET `/api/v1/finance/summary`

Get financial summary for the household.

**Response:**
```json
{
  "data": {
    "totalIncome": 8500.00,
    "totalExpenses": 3250.75,
    "netIncome": 5249.25,
    "transactionCount": 45,
    "topCategories": [
      { "category": "Groceries", "amount": 850.50 },
      { "category": "Utilities", "amount": 420.00 },
      { "category": "Entertainment", "amount": 180.25 }
    ]
  }
}
```

## Enums

### TransactionType

```typescript
enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}
```

### BudgetPeriod

```typescript
enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}
```

## Data Models

### Transaction

```typescript
interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
  paymentMethod?: string;
  isRecurring: boolean;
  recurrence?: string;
  receiptUrl?: string;
  creatorId: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Budget

```typescript
interface Budget {
  id: string;
  name: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  totalBudgeted: number;
  categories: BudgetCategory[];
  creatorId: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}
```

### BudgetCategory

```typescript
interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  budgetId: string;
}
```

## Service Methods

```typescript
class FinanceService {
  // Transactions
  async createTransaction(householdId: string, userId: string, dto: CreateTransactionDto): Promise<Transaction>
  async getTransactions(householdId: string, filters?: TransactionFilters): Promise<Transaction[]>
  async getTransactionById(householdId: string, id: string): Promise<Transaction>
  async updateTransaction(householdId: string, id: string, dto: UpdateTransactionDto): Promise<Transaction>
  async deleteTransaction(householdId: string, id: string): Promise<void>

  // Budgets
  async createBudget(householdId: string, userId: string, dto: CreateBudgetDto): Promise<Budget>
  async getBudgets(householdId: string): Promise<Budget[]>
  async getBudgetById(householdId: string, id: string): Promise<Budget>
  async deleteBudget(householdId: string, id: string): Promise<void>

  // Summary
  async getSummary(householdId: string): Promise<FinanceSummary>
}
```

## Frontend Integration

```typescript
// src/shared/api/finance.api.ts
export const financeApi = {
  // Transactions
  getTransactions: async (filters?: TransactionFilters) => {
    const response = await apiClient.get('/finance/transactions', { params: filters });
    return response.data;
  },

  createTransaction: async (data: CreateTransactionData) => {
    const response = await apiClient.post('/finance/transactions', data);
    return response.data;
  },

  updateTransaction: async (id: string, data: UpdateTransactionData) => {
    const response = await apiClient.patch(`/finance/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string) => {
    await apiClient.delete(`/finance/transactions/${id}`);
  },

  // Budgets
  getBudgets: async () => {
    const response = await apiClient.get('/finance/budgets');
    return response.data;
  },

  createBudget: async (data: CreateBudgetData) => {
    const response = await apiClient.post('/finance/budgets', data);
    return response.data;
  },

  // Summary
  getSummary: async () => {
    const response = await apiClient.get('/finance/summary');
    return response.data;
  }
};
```

## Integration with Scanning

The Scanning module can automatically create transactions from scanned receipts:

```typescript
// When a receipt is scanned and processed
await scanningService.createTransactionFromReceipt(householdId, receiptId, userId);
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Transaction or budget not found |
