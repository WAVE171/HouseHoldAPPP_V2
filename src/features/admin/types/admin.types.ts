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

export interface SystemStats {
  totalUsers: number;
  totalHouseholds: number;
  totalTasks: number;
  totalTransactions: number;
  activeUsersLast24h: number;
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
