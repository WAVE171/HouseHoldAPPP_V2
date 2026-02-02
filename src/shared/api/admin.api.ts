import { apiClient, getApiErrorMessage } from './client';

// Types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';

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

export interface SystemHousehold {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  adminEmail?: string;
  memberCount: number;
  status: HouseholdStatus;
  lastActiveAt?: string;
  createdAt: string;
  stats: {
    tasks: number;
    transactions: number;
    vehicles: number;
    pets: number;
    employees: number;
    children: number;
  };
}

export interface CreateHouseholdData {
  name: string;
  address?: string;
  phone?: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword?: string;
}

export interface UpdateHouseholdData {
  name?: string;
  address?: string;
  phone?: string;
}

export interface HouseholdMember {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  lastLoginAt?: string;
  joinedAt: string;
}

export interface HouseholdCreatedResponse {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  adminEmail: string;
  adminName: string;
  tempPassword?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
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

// Enhanced System Stats for Super Admin Dashboard
export interface EnhancedSystemStats {
  // Core metrics
  totalUsers: number;
  totalHouseholds: number;
  activeHouseholds: number;
  suspendedHouseholds: number;
  inactiveHouseholds: number;

  // Activity metrics
  activeUsersLast24h: number;
  newUsersLast7Days: number;
  newHouseholdsLast30Days: number;

  // Subscription metrics
  subscriptionsByPlan: {
    FREE: number;
    BASIC: number;
    PREMIUM: number;
    ENTERPRISE: number;
  };
}

export type HouseholdStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

// Impersonation Types
export interface ImpersonationResponse {
  impersonationToken: string;
  expiresIn: number;
  targetUser: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    householdId?: string;
    householdName?: string;
  };
  impersonationLogId: string;
}

export interface ImpersonationSession {
  id: string;
  targetUser: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  startedAt: string;
  actionsCount: number;
}

export interface ImpersonationHistoryEntry {
  id: string;
  superAdmin: {
    id: string;
    email: string;
  };
  targetUser: {
    id: string;
    email: string;
    name: string;
  };
  startedAt: string;
  endedAt?: string;
  actionsCount: number;
  duration?: number;
}

export interface ImpersonationHistoryResponse {
  data: ImpersonationHistoryEntry[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface SystemWideUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  householdId?: string;
  householdName?: string;
  lastLoginAt?: string;
  createdAt: string;
}

// API functions
export const adminApi = {
  // ============================================
  // HOUSEHOLD ADMIN ENDPOINTS
  // ============================================

  // User management (within household)
  getAllUsers: async (): Promise<AdminUser[]> => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getUserById: async (userId: string): Promise<AdminUserDetails> => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<AdminUser> => {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  lockUser: async (userId: string, lockedUntil?: string): Promise<{ id: string; email: string; lockedUntil?: string }> => {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/lock`, { lockedUntil });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  unlockUser: async (userId: string): Promise<{ id: string; email: string; lockedUntil: null }> => {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/unlock`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  revokeUserSessions: async (userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/revoke-sessions`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Alias for getAllUsers for consistency
  getUsers: async (): Promise<AdminUser[]> => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Household info (current household)
  getHouseholdInfo: async (): Promise<HouseholdInfo> => {
    try {
      const response = await apiClient.get('/admin/household');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Get household stats (for household admin - uses household info stats)
  getHouseholdStats: async (): Promise<SystemStats> => {
    try {
      const response = await apiClient.get('/admin/household');
      const info = response.data as HouseholdInfo;
      // Transform household info into stats format
      return {
        totalUsers: info.memberCount,
        totalHouseholds: 1,
        totalTasks: info.stats.tasks,
        totalTransactions: info.stats.transactions,
        activeUsersLast24h: 0, // Not available for household-level
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Audit logs
  getAuditLogs: async (query?: AuditLogQuery): Promise<AuditLogResponse> => {
    try {
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
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // ============================================
  // SUPER ADMIN ONLY ENDPOINTS
  // ============================================

  // System stats
  getSystemStats: async (): Promise<SystemStats> => {
    try {
      const response = await apiClient.get('/admin/system/stats');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Household management (Super Admin)
  getAllHouseholds: async (page = 1, limit = 20, search?: string): Promise<PaginatedResponse<SystemHousehold>> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search) params.search = search;
      const response = await apiClient.get('/admin/households', { params });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  createHousehold: async (data: CreateHouseholdData): Promise<HouseholdCreatedResponse> => {
    try {
      const response = await apiClient.post('/admin/households', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getHouseholdById: async (householdId: string): Promise<HouseholdInfo> => {
    try {
      const response = await apiClient.get(`/admin/households/${householdId}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updateHousehold: async (householdId: string, data: UpdateHouseholdData): Promise<SystemHousehold> => {
    try {
      const response = await apiClient.patch(`/admin/households/${householdId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  deleteHousehold: async (householdId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(`/admin/households/${householdId}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getHouseholdMembers: async (householdId: string): Promise<HouseholdMember[]> => {
    try {
      const response = await apiClient.get(`/admin/households/${householdId}/members`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  assignHouseholdAdmin: async (householdId: string, userId: string): Promise<AdminUser> => {
    try {
      const response = await apiClient.post(`/admin/households/${householdId}/admin`, { userId });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // System-wide users (Super Admin)
  getAllUsersSystemWide: async (page = 1, limit = 50): Promise<PaginatedResponse<SystemWideUser>> => {
    try {
      const response = await apiClient.get('/admin/system/users', { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Enhanced system stats (Super Admin)
  getEnhancedSystemStats: async (): Promise<EnhancedSystemStats> => {
    try {
      const response = await apiClient.get('/admin/system/stats');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Suspend household (Super Admin)
  suspendHousehold: async (householdId: string, reason?: string): Promise<{ id: string; name: string; status: string; message: string }> => {
    try {
      const response = await apiClient.post(`/admin/households/${householdId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Unsuspend household (Super Admin)
  unsuspendHousehold: async (householdId: string): Promise<{ id: string; name: string; status: string; message: string }> => {
    try {
      const response = await apiClient.post(`/admin/households/${householdId}/unsuspend`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Reset user password (Super Admin)
  resetUserPassword: async (userId: string, newPassword?: string): Promise<{ userId: string; email: string; tempPassword?: string; message: string }> => {
    try {
      const response = await apiClient.post(`/admin/system/users/${userId}/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // ============================================
  // IMPERSONATION ENDPOINTS (Super Admin)
  // ============================================

  // Start impersonating a user
  startImpersonation: async (userId: string): Promise<ImpersonationResponse> => {
    try {
      const response = await apiClient.post(`/admin/impersonate/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // End impersonation session
  endImpersonation: async (sessionId: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post(`/admin/impersonate/${sessionId}/end`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Get active impersonation sessions
  getActiveSessions: async (): Promise<ImpersonationSession[]> => {
    try {
      const response = await apiClient.get('/admin/impersonate/sessions');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Get impersonation history
  getImpersonationHistory: async (query?: {
    superAdminId?: string;
    targetUserId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<ImpersonationHistoryResponse> => {
    try {
      const params: Record<string, string | number> = {};
      if (query?.superAdminId) params.superAdminId = query.superAdminId;
      if (query?.targetUserId) params.targetUserId = query.targetUserId;
      if (query?.startDate) params.startDate = query.startDate;
      if (query?.endDate) params.endDate = query.endDate;
      if (query?.limit) params.limit = query.limit;
      if (query?.offset) params.offset = query.offset;
      const response = await apiClient.get('/admin/impersonate/history', { params });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
