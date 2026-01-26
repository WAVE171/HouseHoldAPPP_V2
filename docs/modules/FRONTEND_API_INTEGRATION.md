# Frontend API Integration Documentation

## Overview

The frontend API integration layer provides a centralized, type-safe interface for communicating with the backend NestJS API. All API clients are located in `src/shared/api/` and use Axios for HTTP requests.

## Location

```
src/shared/api/
├── client.ts            # Axios instance with interceptors
├── index.ts             # Central export of all API modules
├── auth.api.ts          # Authentication endpoints
├── household.api.ts     # Household management
├── tasks.api.ts         # Task management
├── inventory.api.ts     # Inventory management
├── finance.api.ts       # Finance/budgets/transactions
├── calendar.api.ts      # Calendar events
├── vehicles.api.ts      # Vehicle management
├── pets.api.ts          # Pet management
├── employees.api.ts     # Employee management
├── recipes.api.ts       # Recipe management
├── scanning.api.ts      # Receipt scanning & barcode lookup
├── dashboard.api.ts     # Dashboard statistics
├── admin.api.ts         # Admin operations
└── notifications.api.ts # Notifications
```

## API Client Configuration

### Base Client (`client.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});
```

### Request Interceptor

Automatically attaches the JWT token to all requests:

```typescript
apiClient.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});
```

### Response Interceptor

- Unwraps the `data` property from API responses
- Handles 401 errors by clearing auth and redirecting to login
- Handles network errors gracefully

```typescript
apiClient.interceptors.response.use(
  (response) => {
    // Backend wraps responses in { data: ..., meta: ... }
    if (response.data && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Error Helper

```typescript
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Check for validation errors
    if (error.response?.data?.message) {
      const message = error.response.data.message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      return message;
    }
    // Network error
    if (!error.response) {
      return 'Unable to connect to server.';
    }
    return `Request failed: ${error.response.status}`;
  }
  return 'An unexpected error occurred';
}
```

## API Module Structure

Each API module follows a consistent pattern:

```typescript
// 1. Import the client
import { apiClient } from './client';

// 2. Define TypeScript types
export interface SomeEntity {
  id: string;
  // ... fields
}

export interface CreateSomeEntityData {
  // ... create fields
}

// 3. Export API functions
export const someApi = {
  getAll: async (): Promise<SomeEntity[]> => {
    const response = await apiClient.get('/some-resource');
    return response.data;
  },

  getById: async (id: string): Promise<SomeEntity> => {
    const response = await apiClient.get(`/some-resource/${id}`);
    return response.data;
  },

  create: async (data: CreateSomeEntityData): Promise<SomeEntity> => {
    const response = await apiClient.post('/some-resource', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSomeEntityData>): Promise<SomeEntity> => {
    const response = await apiClient.patch(`/some-resource/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/some-resource/${id}`);
  },
};
```

## Available API Modules

### Authentication (`auth.api.ts`)

```typescript
import { authApi } from '@/shared/api';

// Login
const { user, token, refreshToken } = await authApi.login(email, password);

// Register
const { user, token, refreshToken } = await authApi.register({
  email, password, firstName, lastName
});

// Refresh token
const { token, refreshToken } = await authApi.refreshToken(refreshToken);

// Logout
await authApi.logout();
```

### Tasks (`tasks.api.ts`)

```typescript
import { tasksApi } from '@/shared/api';

// Get all tasks (with optional filters)
const tasks = await tasksApi.getTasks({ status: 'PENDING', priority: 'HIGH' });

// Create task
const task = await tasksApi.createTask({
  title: 'Clean garage',
  priority: 'HIGH',
  dueDate: '2026-02-01T00:00:00.000Z'
});

// Update task
const updated = await tasksApi.updateTask(taskId, { status: 'COMPLETED' });

// Delete task
await tasksApi.deleteTask(taskId);
```

### Inventory (`inventory.api.ts`)

```typescript
import { inventoryApi } from '@/shared/api';

// Categories
const categories = await inventoryApi.getCategories();
const category = await inventoryApi.createCategory({ name: 'Pantry', icon: 'package' });

// Items
const items = await inventoryApi.getItems();
const item = await inventoryApi.createItem({
  name: 'Olive Oil',
  quantity: 2,
  unit: 'bottles',
  categoryId: 'clx...'
});

// Stock update
await inventoryApi.updateStock(itemId, -1, 'Used 1 bottle');
```

### Finance (`finance.api.ts`)

```typescript
import { financeApi } from '@/shared/api';

// Transactions
const transactions = await financeApi.getTransactions({ type: 'EXPENSE' });
const transaction = await financeApi.createTransaction({
  type: 'EXPENSE',
  amount: 125.50,
  category: 'Groceries',
  date: '2026-01-26T00:00:00.000Z'
});

// Budgets
const budgets = await financeApi.getBudgets();
const budget = await financeApi.createBudget({
  name: 'January Budget',
  totalBudgeted: 5000,
  categories: [{ name: 'Groceries', budgeted: 800 }]
});

// Summary
const summary = await financeApi.getSummary();
```

### Dashboard (`dashboard.api.ts`)

```typescript
import { dashboardApi } from '@/shared/api';

// Get all dashboard data
const stats = await dashboardApi.getStats();
const activity = await dashboardApi.getRecentActivity(10);
const tasks = await dashboardApi.getUpcomingTasks(7);
const events = await dashboardApi.getUpcomingEvents(7);
const expiring = await dashboardApi.getExpiringItems(7);
const finance = await dashboardApi.getFinanceSummary();
```

### Scanning (`scanning.api.ts`)

```typescript
import { scanningApi } from '@/shared/api';

// Create receipt from scanned data
const receipt = await scanningApi.createReceipt({
  storeName: 'Supermarket',
  total: 50.05,
  date: '2026-01-26T00:00:00.000Z',
  items: [
    { name: 'Milk', quantity: 2, unitPrice: 3.50, totalPrice: 7.00 }
  ]
});

// Create transaction from receipt
const { transactionId } = await scanningApi.createTransactionFromReceipt(receiptId);

// Add items to inventory
await scanningApi.addReceiptItemsToInventory(receiptId, categoryId);

// Barcode lookup
const product = await scanningApi.lookupBarcode('8001234567890');
```

### Notifications (`notifications.api.ts`)

```typescript
import { notificationsApi } from '@/shared/api';

// Get notifications
const { data, meta } = await notificationsApi.getNotifications({ unreadOnly: true });

// Get unread count
const { count } = await notificationsApi.getUnreadCount();

// Mark as read
await notificationsApi.markAsRead(notificationId);
await notificationsApi.markAllAsRead();

// Delete
await notificationsApi.deleteNotification(notificationId);
await notificationsApi.deleteAllRead();
```

## Usage in React Components

### With React Query (Recommended)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/shared/api';

function TasksList() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.getTasks()
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {tasks?.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

### With Zustand Store

```typescript
// stores/taskStore.ts
import { create } from 'zustand';
import { tasksApi, Task } from '@/shared/api';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await tasksApi.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTask: async (data) => {
    const task = await tasksApi.createTask(data);
    set({ tasks: [...get().tasks, task] });
  }
}));
```

## Environment Configuration

Create a `.env` file in the project root:

```env
# API URL (defaults to http://localhost:3001/api/v1)
VITE_API_URL=http://localhost:3001/api/v1
```

## Type Exports

All types are exported from the central index:

```typescript
import {
  // API clients
  authApi,
  tasksApi,
  inventoryApi,
  financeApi,
  // ... etc

  // Types
  Task,
  CreateTaskData,
  TaskStatus,
  InventoryItem,
  Transaction,
  // ... etc
} from '@/shared/api';
```

## Error Handling Pattern

```typescript
import { getApiErrorMessage } from '@/shared/api';

async function handleSubmit(data: CreateTaskData) {
  try {
    await tasksApi.createTask(data);
    toast.success('Task created!');
  } catch (error) {
    const message = getApiErrorMessage(error);
    toast.error(message);
  }
}
```

## API Response Format

All API responses from the backend follow this format:

```json
{
  "data": { ... },      // The actual response data
  "meta": { ... }       // Optional metadata (pagination, etc.)
}
```

The response interceptor automatically unwraps the `data` property, so your API calls receive the inner data directly.
