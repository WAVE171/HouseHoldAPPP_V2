import { apiClient } from './client';

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

// API functions
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (limit?: number): Promise<ActivityItem[]> => {
    const params = limit ? { limit: limit.toString() } : {};
    const response = await apiClient.get('/dashboard/recent-activity', { params });
    return response.data;
  },

  getUpcomingTasks: async (days?: number): Promise<UpcomingTask[]> => {
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/upcoming-tasks', { params });
    return response.data;
  },

  getUpcomingEvents: async (days?: number): Promise<UpcomingEvent[]> => {
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/upcoming-events', { params });
    return response.data;
  },

  getExpiringItems: async (days?: number): Promise<ExpiringItem[]> => {
    const params = days ? { days: days.toString() } : {};
    const response = await apiClient.get('/dashboard/expiring-items', { params });
    return response.data;
  },

  getFinanceSummary: async (): Promise<FinanceSummary> => {
    const response = await apiClient.get('/dashboard/finance-summary');
    return response.data;
  },
};
