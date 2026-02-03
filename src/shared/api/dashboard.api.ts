import { apiClient } from './client';

// Enable mock mode
const USE_MOCK_API = true;
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Types
export interface DashboardStats {
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

export interface ActivityItem {
  type: 'task' | 'transaction' | 'event';
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  assignee?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  category: string;
  allDay: boolean;
}

export interface ExpiringItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  category: string;
  daysUntilExpiry?: number;
}

export interface FinanceSummary {
  income: number;
  expenses: number;
  net: number;
  budgetTotal: number;
  budgetRemaining: number;
  budgetUsedPercent: number;
}

// Mock data
const mockStats: DashboardStats = {
  tasks: { total: 15, pending: 6, completed: 9, completionRate: 60 },
  inventory: { total: 48, lowStock: 5 },
  calendar: { upcomingEvents: 3 },
  finance: { totalTransactions: 45, monthlyExpenses: 1250.50, totalBudgets: 4 },
  vehicles: 2,
  pets: 1,
  employees: 1,
  recipes: 12,
};

const mockActivity: ActivityItem[] = [
  { type: 'task', id: 't1', title: 'Grocery shopping', description: 'Weekly groceries', timestamp: new Date().toISOString(), user: 'Admin User' },
  { type: 'transaction', id: 'tr1', title: 'Electricity bill', description: 'Monthly payment', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { type: 'event', id: 'e1', title: 'Family dinner', timestamp: new Date(Date.now() - 7200000).toISOString() },
];

const mockTasks: UpcomingTask[] = [
  { id: 't1', title: 'Grocery shopping', description: 'Buy weekly groceries', dueDate: new Date(Date.now() + 86400000).toISOString(), priority: 'HIGH', status: 'PENDING', assignee: 'Parent User' },
  { id: 't2', title: 'Pay bills', dueDate: new Date(Date.now() + 172800000).toISOString(), priority: 'MEDIUM', status: 'PENDING' },
];

const mockEvents: UpcomingEvent[] = [
  { id: 'e1', title: 'Family dinner', startDate: new Date(Date.now() + 86400000).toISOString(), endDate: new Date(Date.now() + 90000000).toISOString(), category: 'FAMILY', allDay: false },
  { id: 'e2', title: 'School meeting', startDate: new Date(Date.now() + 172800000).toISOString(), endDate: new Date(Date.now() + 176400000).toISOString(), location: 'School', category: 'APPOINTMENT', allDay: false },
];

const mockExpiringItems: ExpiringItem[] = [
  { id: 'i1', name: 'Milk', quantity: 2, unit: 'liters', expiryDate: new Date(Date.now() + 172800000).toISOString(), category: 'Dairy', daysUntilExpiry: 2 },
  { id: 'i2', name: 'Yogurt', quantity: 4, unit: 'pcs', expiryDate: new Date(Date.now() + 259200000).toISOString(), category: 'Dairy', daysUntilExpiry: 3 },
];

const mockFinanceSummary: FinanceSummary = {
  income: 5000,
  expenses: 1250.50,
  net: 3749.50,
  budgetTotal: 2000,
  budgetRemaining: 749.50,
  budgetUsedPercent: 62.5,
};

// API functions
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockStats;
    }
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (limit?: number): Promise<ActivityItem[]> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return limit ? mockActivity.slice(0, limit) : mockActivity;
    }
    const params = limit ? { limit: limit.toString() } : {};
    const response = await apiClient.get('/dashboard/recent-activity', { params });
    return response.data;
  },

  getUpcomingTasks: async (days?: number): Promise<UpcomingTask[]> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockTasks;
    }
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/upcoming-tasks', { params });
    return response.data;
  },

  getUpcomingEvents: async (days?: number): Promise<UpcomingEvent[]> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockEvents;
    }
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/upcoming-events', { params });
    return response.data;
  },

  getExpiringItems: async (days?: number): Promise<ExpiringItem[]> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockExpiringItems;
    }
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/expiring-items', { params });
    return response.data;
  },

  getFinanceSummary: async (): Promise<FinanceSummary> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockFinanceSummary;
    }
    const response = await apiClient.get('/dashboard/finance-summary');
    return response.data;
  },
};
