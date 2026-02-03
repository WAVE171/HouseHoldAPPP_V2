import { apiClient, getApiErrorMessage } from './client';

// Enable mock mode when API is unavailable
// Set VITE_USE_MOCK_API=true in .env to enable mock mode
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Mock delay to simulate network
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

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
  activeUsers: number;
  activeHouseholds: number;
  newUsersThisMonth: number;
  newHouseholdsThisMonth: number;
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

// Subscription Types
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
export type BillingCycle = 'MONTHLY' | 'YEARLY';

export interface Subscription {
  id: string;
  householdId: string;
  householdName: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStats {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledThisMonth: number;
  byPlan: {
    FREE: number;
    BASIC: number;
    PREMIUM: number;
    ENTERPRISE: number;
  };
}

export interface SystemSettings {
  siteName: string;
  supportEmail: string;
  defaultTrialDays: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  emailNotificationsEnabled: boolean;
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

// ============================================
// MOCK DATA FOR FRONTEND DEVELOPMENT
// ============================================

const mockHouseholds: SystemHousehold[] = [
  {
    id: 'household-1',
    name: 'Smith Family',
    address: '123 Main Street, Lisbon',
    phone: '+351 912 345 678',
    adminEmail: 'admin@example.com',
    memberCount: 4,
    status: 'ACTIVE',
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { tasks: 15, transactions: 45, vehicles: 2, pets: 1, employees: 1, children: 2 },
  },
  {
    id: 'household-2',
    name: 'Johnson Residence',
    address: '456 Oak Avenue, Porto',
    adminEmail: 'johnson@example.com',
    memberCount: 3,
    status: 'ACTIVE',
    lastActiveAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { tasks: 8, transactions: 22, vehicles: 1, pets: 2, employees: 0, children: 1 },
  },
  {
    id: 'household-3',
    name: 'Garcia Family',
    address: '789 Pine Road, Faro',
    adminEmail: 'garcia@example.com',
    memberCount: 5,
    status: 'SUSPENDED',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    stats: { tasks: 3, transactions: 10, vehicles: 0, pets: 0, employees: 0, children: 3 },
  },
];

const mockUsers: SystemWideUser[] = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    role: 'ADMIN',
    firstName: 'Admin',
    lastName: 'User',
    householdId: 'household-1',
    householdName: 'Smith Family',
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-2',
    email: 'parent@example.com',
    role: 'PARENT',
    firstName: 'Parent',
    lastName: 'User',
    householdId: 'household-1',
    householdName: 'Smith Family',
    lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-3',
    email: 'member@example.com',
    role: 'MEMBER',
    firstName: 'Family',
    lastName: 'Member',
    householdId: 'household-1',
    householdName: 'Smith Family',
    lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-4',
    email: 'johnson@example.com',
    role: 'ADMIN',
    firstName: 'John',
    lastName: 'Johnson',
    householdId: 'household-2',
    householdName: 'Johnson Residence',
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-super',
    userEmail: 'superadmin@example.com',
    action: 'LOGIN',
    resource: 'auth',
    createdAt: new Date().toISOString(),
    ipAddress: '192.168.1.1',
  },
  {
    id: 'log-2',
    userId: 'user-1',
    userEmail: 'admin@example.com',
    action: 'CREATE',
    resource: 'task',
    resourceId: 'task-123',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.2',
  },
  {
    id: 'log-3',
    userId: 'user-super',
    userEmail: 'superadmin@example.com',
    action: 'SUSPEND',
    resource: 'household',
    resourceId: 'household-3',
    details: { reason: 'Payment overdue' },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.1',
  },
];

const mockImpersonationHistory: ImpersonationHistoryEntry[] = [
  {
    id: 'imp-1',
    superAdmin: { id: 'user-super', email: 'superadmin@example.com' },
    targetUser: { id: 'user-1', email: 'admin@example.com', name: 'Admin User' },
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
    actionsCount: 5,
    duration: 15,
  },
  {
    id: 'imp-2',
    superAdmin: { id: 'user-super', email: 'superadmin@example.com' },
    targetUser: { id: 'user-4', email: 'johnson@example.com', name: 'John Johnson' },
    startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    actionsCount: 12,
    duration: 30,
  },
];

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    householdId: 'household-1',
    householdName: 'Smith Family',
    plan: 'PREMIUM',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 19.99,
    currency: 'USD',
    billingCycle: 'MONTHLY',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    householdId: 'household-2',
    householdName: 'Johnson Residence',
    plan: 'BASIC',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'MONTHLY',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-3',
    householdId: 'household-3',
    householdName: 'Garcia Family',
    plan: 'FREE',
    status: 'TRIAL',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 0,
    currency: 'USD',
    billingCycle: 'MONTHLY',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-4',
    householdId: 'household-4',
    householdName: 'Williams House',
    plan: 'BASIC',
    status: 'PAST_DUE',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'MONTHLY',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub-5',
    householdId: 'household-5',
    householdName: 'Brown Estate',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 99.99,
    currency: 'USD',
    billingCycle: 'YEARLY',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockSubscriptionStats: SubscriptionStats = {
  totalRevenue: 15847.50,
  monthlyRecurringRevenue: 1249.85,
  activeSubscriptions: 42,
  trialSubscriptions: 8,
  cancelledThisMonth: 3,
  byPlan: {
    FREE: 15,
    BASIC: 20,
    PREMIUM: 12,
    ENTERPRISE: 3,
  },
};

const mockSystemSettings: SystemSettings = {
  siteName: 'Household Hero',
  supportEmail: 'support@householdhero.com',
  defaultTrialDays: 14,
  maintenanceMode: false,
  registrationEnabled: true,
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  emailNotificationsEnabled: true,
};

// API functions
export const adminApi = {
  // ============================================
  // HOUSEHOLD ADMIN ENDPOINTS
  // ============================================

  // User management (within household)
  getAllUsers: async (): Promise<AdminUser[]> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockUsers.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        lastLoginAt: u.lastLoginAt,
        isLocked: false,
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        createdAt: u.createdAt,
      }));
    }
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
    if (USE_MOCK_API) {
      await mockDelay();
      return {
        totalUsers: 4,
        totalHouseholds: 1,
        totalTasks: 15,
        totalTransactions: 45,
        activeUsers: 2,
        activeHouseholds: 1,
        newUsersThisMonth: 1,
        newHouseholdsThisMonth: 0,
      };
    }
    try {
      const response = await apiClient.get('/admin/household');
      const info = response.data as HouseholdInfo;
      // Transform household info into stats format
      return {
        totalUsers: info.memberCount,
        totalHouseholds: 1,
        totalTasks: info.stats.tasks,
        totalTransactions: info.stats.transactions,
        activeUsers: 0, // Not available for household-level
        activeHouseholds: 1,
        newUsersThisMonth: 0,
        newHouseholdsThisMonth: 0,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Audit logs
  getAuditLogs: async (query?: AuditLogQuery): Promise<AuditLogResponse> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const limit = query?.limit || 50;
      const offset = query?.offset || 0;
      return {
        data: mockAuditLogs.slice(offset, offset + limit),
        meta: {
          total: mockAuditLogs.length,
          limit,
          offset,
          hasMore: offset + limit < mockAuditLogs.length,
        },
      };
    }
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
    if (USE_MOCK_API) {
      await mockDelay();
      let filtered = [...mockHouseholds];
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(h =>
          h.name.toLowerCase().includes(searchLower) ||
          h.adminEmail?.toLowerCase().includes(searchLower)
        );
      }
      const start = (page - 1) * limit;
      const paginatedData = filtered.slice(start, start + limit);
      return {
        data: paginatedData,
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        },
      };
    }
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
    if (USE_MOCK_API) {
      await mockDelay();
      const start = (page - 1) * limit;
      return {
        data: mockUsers.slice(start, start + limit),
        meta: {
          total: mockUsers.length,
          page,
          limit,
          totalPages: Math.ceil(mockUsers.length / limit),
        },
      };
    }
    try {
      const response = await apiClient.get('/admin/system/users', { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Enhanced system stats (Super Admin)
  getEnhancedSystemStats: async (): Promise<EnhancedSystemStats> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return {
        totalUsers: mockUsers.length + 1, // +1 for superadmin
        totalHouseholds: mockHouseholds.length,
        activeHouseholds: mockHouseholds.filter(h => h.status === 'ACTIVE').length,
        suspendedHouseholds: mockHouseholds.filter(h => h.status === 'SUSPENDED').length,
        inactiveHouseholds: mockHouseholds.filter(h => h.status === 'INACTIVE').length,
        activeUsersLast24h: 3,
        newUsersLast7Days: 2,
        newHouseholdsLast30Days: 1,
        subscriptionsByPlan: {
          FREE: 2,
          BASIC: 1,
          PREMIUM: 0,
          ENTERPRISE: 0,
        },
      };
    }
    try {
      const response = await apiClient.get('/admin/system/stats');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Suspend household (Super Admin)
  suspendHousehold: async (householdId: string, reason?: string): Promise<{ id: string; name: string; status: string; message: string }> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const household = mockHouseholds.find(h => h.id === householdId);
      if (household) {
        household.status = 'SUSPENDED';
      }
      return {
        id: householdId,
        name: household?.name || 'Unknown',
        status: 'SUSPENDED',
        message: `Household suspended${reason ? `: ${reason}` : ''}`,
      };
    }
    try {
      const response = await apiClient.post(`/admin/households/${householdId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Unsuspend household (Super Admin)
  unsuspendHousehold: async (householdId: string): Promise<{ id: string; name: string; status: string; message: string }> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const household = mockHouseholds.find(h => h.id === householdId);
      if (household) {
        household.status = 'ACTIVE';
      }
      return {
        id: householdId,
        name: household?.name || 'Unknown',
        status: 'ACTIVE',
        message: 'Household reactivated',
      };
    }
    try {
      const response = await apiClient.post(`/admin/households/${householdId}/unsuspend`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Reset user password (Super Admin)
  resetUserPassword: async (userId: string, newPassword?: string): Promise<{ userId: string; email: string; tempPassword?: string; message: string }> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const user = mockUsers.find(u => u.id === userId);
      const tempPassword = newPassword || 'TempPass123!';
      return {
        userId,
        email: user?.email || 'unknown@example.com',
        tempPassword,
        message: 'Password has been reset',
      };
    }
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
    if (USE_MOCK_API) {
      await mockDelay();
      const limit = query?.limit || 20;
      const offset = query?.offset || 0;
      return {
        data: mockImpersonationHistory.slice(offset, offset + limit),
        meta: {
          total: mockImpersonationHistory.length,
          limit,
          offset,
        },
      };
    }
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

  // ============================================
  // SUBSCRIPTION MANAGEMENT (Super Admin)
  // ============================================

  // Get all subscriptions
  getSubscriptions: async (query?: {
    plan?: SubscriptionPlan;
    status?: SubscriptionStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Subscription>> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const limit = query?.limit || 20;
      const page = query?.page || 1;
      let filtered = [...mockSubscriptions];

      if (query?.plan) {
        filtered = filtered.filter(s => s.plan === query.plan);
      }
      if (query?.status) {
        filtered = filtered.filter(s => s.status === query.status);
      }
      if (query?.search) {
        const searchLower = query.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.householdName.toLowerCase().includes(searchLower)
        );
      }

      const start = (page - 1) * limit;
      return {
        data: filtered.slice(start, start + limit),
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
          hasMore: start + limit < filtered.length,
        },
      };
    }
    try {
      const params: Record<string, string | number> = {};
      if (query?.plan) params.plan = query.plan;
      if (query?.status) params.status = query.status;
      if (query?.search) params.search = query.search;
      if (query?.page) params.page = query.page;
      if (query?.limit) params.limit = query.limit;
      const response = await apiClient.get('/admin/subscriptions', { params });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Get subscription stats
  getSubscriptionStats: async (): Promise<SubscriptionStats> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockSubscriptionStats;
    }
    try {
      const response = await apiClient.get('/admin/subscriptions/stats');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Update subscription
  updateSubscription: async (
    subscriptionId: string,
    data: { plan?: SubscriptionPlan; status?: SubscriptionStatus }
  ): Promise<Subscription> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const subscription = mockSubscriptions.find(s => s.id === subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      if (data.plan) subscription.plan = data.plan;
      if (data.status) subscription.status = data.status;
      subscription.updatedAt = new Date().toISOString();
      return subscription;
    }
    try {
      const response = await apiClient.patch(`/admin/subscriptions/${subscriptionId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Extend trial
  extendTrial: async (subscriptionId: string, days: number): Promise<Subscription> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const subscription = mockSubscriptions.find(s => s.id === subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      const currentTrialEnd = subscription.trialEndsAt
        ? new Date(subscription.trialEndsAt)
        : new Date();
      currentTrialEnd.setDate(currentTrialEnd.getDate() + days);
      subscription.trialEndsAt = currentTrialEnd.toISOString();
      subscription.status = 'TRIAL';
      subscription.updatedAt = new Date().toISOString();
      return subscription;
    }
    try {
      const response = await apiClient.post(`/admin/subscriptions/${subscriptionId}/extend-trial`, { days });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string, reason?: string): Promise<Subscription> => {
    if (USE_MOCK_API) {
      await mockDelay();
      const subscription = mockSubscriptions.find(s => s.id === subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }
      subscription.status = 'CANCELLED';
      subscription.updatedAt = new Date().toISOString();
      return subscription;
    }
    try {
      const response = await apiClient.post(`/admin/subscriptions/${subscriptionId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // ============================================
  // SYSTEM SETTINGS (Super Admin)
  // ============================================

  // Get system settings
  getSystemSettings: async (): Promise<SystemSettings> => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockSystemSettings;
    }
    try {
      const response = await apiClient.get('/admin/settings');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  // Update system settings
  updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    if (USE_MOCK_API) {
      await mockDelay();
      Object.assign(mockSystemSettings, settings);
      return mockSystemSettings;
    }
    try {
      const response = await apiClient.patch('/admin/settings', settings);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};
