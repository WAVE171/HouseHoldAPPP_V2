import { apiClient } from './client';

// Types
export type UserRole = 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  lastLoginAt?: string;
  isLocked: boolean;
  lockedUntil?: string;
  failedLoginAttempts: number;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface AdminUserDetails extends AdminUser {
  phone?: string;
  recentSessions: {
    id: string;
    createdAt: string;
    expiresAt: string;
  }[];
}

export interface HouseholdInfo {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  creatorEmail: string;
  memberCount: number;
  members: {
    firstName: string;
    lastName: string;
    role: UserRole;
  }[];
  stats: {
    tasks: number;
    events: number;
    inventoryItems: number;
    transactions: number;
    vehicles: number;
    pets: number;
    employees: number;
    recipes: number;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogQuery {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogResponse {
  data: AuditLog[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SystemStats {
  totalUsers: number;
  totalHouseholds: number;
  totalTasks: number;
  totalTransactions: number;
  activeUsersLast24h: number;
}

// API functions
export const adminApi = {
  // User management
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  getUserById: async (userId: string): Promise<AdminUserDetails> => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<AdminUser> => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  lockUser: async (userId: string, lockedUntil?: string): Promise<{ id: string; email: string; lockedUntil?: string }> => {
    const response = await apiClient.post(`/admin/users/${userId}/lock`, { lockedUntil });
    return response.data;
  },

  unlockUser: async (userId: string): Promise<{ id: string; email: string; lockedUntil: null }> => {
    const response = await apiClient.post(`/admin/users/${userId}/unlock`);
    return response.data;
  },

  revokeUserSessions: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/admin/users/${userId}/revoke-sessions`);
    return response.data;
  },

  // Household management
  getHouseholdInfo: async (): Promise<HouseholdInfo> => {
    const response = await apiClient.get('/admin/household');
    return response.data;
  },

  // Audit logs
  getAuditLogs: async (query?: AuditLogQuery): Promise<AuditLogResponse> => {
    const params: Record<string, string> = {};
    if (query?.userId) params.userId = query.userId;
    if (query?.action) params.action = query.action;
    if (query?.resource) params.resource = query.resource;
    if (query?.startDate) params.startDate = query.startDate;
    if (query?.endDate) params.endDate = query.endDate;
    if (query?.limit) params.limit = query.limit.toString();
    if (query?.offset) params.offset = query.offset.toString();

    const response = await apiClient.get('/admin/audit-logs', { params });
    return response.data;
  },

  // System stats
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await apiClient.get('/admin/system-stats');
    return response.data;
  },
};
