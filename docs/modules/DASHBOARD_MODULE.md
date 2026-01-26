# Dashboard Module Documentation

## Overview

The Dashboard module provides aggregated statistics and summary data from all household modules, powering the application's main dashboard with real-time insights.

## Location

```
apps/api/src/modules/dashboard/
├── dashboard.controller.ts
├── dashboard.service.ts
└── dashboard.module.ts
```

## Endpoints

### GET `/api/v1/dashboard/stats`

Get comprehensive household statistics.

**Response:**
```json
{
  "data": {
    "tasks": {
      "total": 45,
      "pending": 12,
      "completed": 30,
      "completionRate": 67
    },
    "inventory": {
      "total": 150,
      "lowStock": 5
    },
    "calendar": {
      "upcomingEvents": 8
    },
    "finance": {
      "totalTransactions": 230,
      "monthlyExpenses": 3250.75,
      "totalBudgets": 3
    },
    "vehicles": 2,
    "pets": 3,
    "employees": 2,
    "recipes": 25
  }
}
```

### GET `/api/v1/dashboard/recent-activity`

Get recent activity across all modules.

**Query Parameters:**
- `limit` - Number of activities to return (default: 20)

**Response:**
```json
{
  "data": [
    {
      "type": "task",
      "id": "clx...",
      "title": "Clean the garage",
      "description": "Task completed",
      "timestamp": "2026-01-26T14:30:00.000Z",
      "user": "John Doe"
    },
    {
      "type": "transaction",
      "id": "clx...",
      "title": "-$125.50",
      "description": "Groceries",
      "timestamp": "2026-01-26T12:00:00.000Z"
    },
    {
      "type": "event",
      "id": "clx...",
      "title": "Family Dinner",
      "description": "Event on 1/28/2026",
      "timestamp": "2026-01-26T10:00:00.000Z"
    }
  ]
}
```

### GET `/api/v1/dashboard/upcoming-tasks`

Get upcoming tasks within a time window.

**Query Parameters:**
- `days` - Number of days to look ahead (default: 7)

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "title": "Pay bills",
      "description": "Monthly utilities",
      "dueDate": "2026-01-30T00:00:00.000Z",
      "priority": "HIGH",
      "status": "PENDING",
      "assignee": "Jane Doe"
    }
  ]
}
```

### GET `/api/v1/dashboard/upcoming-events`

Get upcoming calendar events.

**Query Parameters:**
- `days` - Number of days to look ahead (default: 7)

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "title": "Family Dinner",
      "description": "Monthly gathering",
      "startDate": "2026-01-28T18:00:00.000Z",
      "endDate": "2026-01-28T21:00:00.000Z",
      "location": "Home",
      "category": "MEETING",
      "allDay": false
    }
  ]
}
```

### GET `/api/v1/dashboard/expiring-items`

Get inventory items expiring soon.

**Query Parameters:**
- `days` - Number of days to look ahead (default: 7)

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Milk",
      "quantity": 1,
      "unit": "gallon",
      "expiryDate": "2026-01-29T00:00:00.000Z",
      "category": "Dairy",
      "daysUntilExpiry": 3
    }
  ]
}
```

### GET `/api/v1/dashboard/finance-summary`

Get current month's financial summary.

**Response:**
```json
{
  "data": {
    "income": 8500.00,
    "expenses": 3250.75,
    "net": 5249.25,
    "budgetTotal": 5000.00,
    "budgetRemaining": 1749.25,
    "budgetUsedPercent": 65
  }
}
```

## Data Models

### DashboardStats

```typescript
interface DashboardStats {
  tasks: {
    total: number;
    pending: number;
    completed: number;
    completionRate: number;
  };
  inventory: {
    total: number;
    lowStock: number;
  };
  calendar: {
    upcomingEvents: number;
  };
  finance: {
    totalTransactions: number;
    monthlyExpenses: number;
    totalBudgets: number;
  };
  vehicles: number;
  pets: number;
  employees: number;
  recipes: number;
}
```

### ActivityItem

```typescript
interface ActivityItem {
  type: 'task' | 'transaction' | 'event';
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
}
```

### UpcomingTask

```typescript
interface UpcomingTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  assignee?: string;
}
```

### UpcomingEvent

```typescript
interface UpcomingEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  category: string;
  allDay: boolean;
}
```

### ExpiringItem

```typescript
interface ExpiringItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  category: string;
  daysUntilExpiry?: number;
}
```

### FinanceSummary

```typescript
interface FinanceSummary {
  income: number;
  expenses: number;
  net: number;
  budgetTotal: number;
  budgetRemaining: number;
  budgetUsedPercent: number;
}
```

## Service Methods

```typescript
class DashboardService {
  async getStats(householdId: string): Promise<DashboardStats>
  async getRecentActivity(householdId: string, limit?: number): Promise<ActivityItem[]>
  async getUpcomingTasks(householdId: string, days?: number): Promise<UpcomingTask[]>
  async getUpcomingEvents(householdId: string, days?: number): Promise<UpcomingEvent[]>
  async getExpiringItems(householdId: string, days?: number): Promise<ExpiringItem[]>
  async getFinanceSummary(householdId: string): Promise<FinanceSummary>
}
```

## Frontend Integration

```typescript
// src/shared/api/dashboard.api.ts
export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (limit?: number) => {
    const params = limit ? { limit: limit.toString() } : {};
    const response = await apiClient.get('/dashboard/recent-activity', { params });
    return response.data;
  },

  getUpcomingTasks: async (days?: number) => {
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/upcoming-tasks', { params });
    return response.data;
  },

  getUpcomingEvents: async (days?: number) => {
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/upcoming-events', { params });
    return response.data;
  },

  getExpiringItems: async (days?: number) => {
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/expiring-items', { params });
    return response.data;
  },

  getFinanceSummary: async () => {
    const response = await apiClient.get('/dashboard/finance-summary');
    return response.data;
  }
};
```

## Implementation Details

### Stats Aggregation
- Uses `Promise.all` for parallel database queries
- Task completion rate is calculated as `(completed / total) * 100`
- Monthly expenses are calculated from the 1st of current month
- Low stock calculation compares quantity to lowStockThreshold

### Recent Activity
- Combines tasks, transactions, and events
- Sorted by timestamp (most recent first)
- Includes user information where available

### Expiring Items
- Calculates `daysUntilExpiry` for each item
- Only includes items with expiry dates in the future

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | No household access |
