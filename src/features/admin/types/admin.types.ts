export interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';
  status: 'active' | 'inactive' | 'suspended';
  householdId?: string;
  householdName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SystemHousehold {
  id: string;
  name: string;
  ownerEmail: string;
  memberCount: number;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastActivityAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalHouseholds: number;
  activeHouseholds: number;
  newUsersThisMonth: number;
  newHouseholdsThisMonth: number;
}
