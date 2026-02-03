export type AdminUserRole = 'SUPER_ADMIN' | 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';

export interface SystemUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: AdminUserRole;
  avatar?: string;
  householdId?: string;
  householdName?: string;
  lastLoginAt?: string;
  isLocked?: boolean;
  lockedUntil?: string;
  failedLoginAttempts?: number;
  twoFactorEnabled?: boolean;
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
  role: AdminUserRole;
  avatar?: string;
  lastLoginAt?: string;
  joinedAt: string;
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

// SystemStats for Household Admin dashboard
export interface SystemStats {
  totalUsers: number;
  totalHouseholds: number;
  totalTasks: number;
  totalTransactions: number;
  activeUsers: number; // Active users in last 24h
  activeHouseholds: number; // For super admin compatibility
  newUsersThisMonth: number; // New users this month
  newHouseholdsThisMonth: number; // New households this month
}

// Enhanced SystemStats for Super Admin dashboard
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

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

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
