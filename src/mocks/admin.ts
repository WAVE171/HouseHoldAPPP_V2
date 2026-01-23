// Stub file - API integration pending

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminHousehold {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: string;
}

export interface SystemStats {
  totalUsers: number;
  totalHouseholds: number;
  activeUsers: number;
  storageUsed: number;
}

export const mockAdminUsers: AdminUser[] = [];
export const mockAdminHouseholds: AdminHousehold[] = [];
export const mockAuditLogs: AuditLog[] = [];
export const mockSystemStats: SystemStats = {
  totalUsers: 0,
  totalHouseholds: 0,
  activeUsers: 0,
  storageUsed: 0,
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  return [];
}

export async function getAdminHouseholds(): Promise<AdminHousehold[]> {
  return [];
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return [];
}

export async function getSystemStats(): Promise<SystemStats> {
  return mockSystemStats;
}

export async function updateUserStatus(_id: string, _status: string): Promise<AdminUser> {
  throw new Error('API integration required');
}

export async function deleteUser(_id: string): Promise<void> {
  return;
}
