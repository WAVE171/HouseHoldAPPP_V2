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

const today = new Date();
const getDate = (daysOffset: number, hours?: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  if (hours !== undefined) {
    date.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  }
  return date.toISOString();
};

export const mockUsers: SystemUser[] = [
  {
    id: '1',
    email: 'john@household.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'PARENT',
    status: 'active',
    householdId: '1',
    householdName: 'The Smith Family',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: getDate(0, 8),
  },
  {
    id: '2',
    email: 'sarah@household.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'PARENT',
    status: 'active',
    householdId: '1',
    householdName: 'The Smith Family',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: getDate(0, 9),
  },
  {
    id: '3',
    email: 'tommy@household.com',
    firstName: 'Tommy',
    lastName: 'Smith',
    role: 'MEMBER',
    status: 'active',
    householdId: '1',
    householdName: 'The Smith Family',
    createdAt: '2024-01-05T00:00:00Z',
    lastLoginAt: getDate(-1, 15),
  },
  {
    id: '4',
    email: 'admin@system.com',
    firstName: 'System',
    lastName: 'Admin',
    role: 'ADMIN',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    lastLoginAt: getDate(0, 10),
  },
  {
    id: '5',
    email: 'mike@example.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'PARENT',
    status: 'active',
    householdId: '2',
    householdName: 'Johnson Residence',
    createdAt: '2024-02-15T00:00:00Z',
    lastLoginAt: getDate(-2, 12),
  },
  {
    id: '6',
    email: 'suspended@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'MEMBER',
    status: 'suspended',
    householdId: '3',
    householdName: 'Doe Family',
    createdAt: '2024-03-01T00:00:00Z',
  },
];

export const mockHouseholds: SystemHousehold[] = [
  {
    id: '1',
    name: 'The Smith Family',
    ownerEmail: 'john@household.com',
    memberCount: 5,
    plan: 'premium',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastActivityAt: getDate(0, 9),
  },
  {
    id: '2',
    name: 'Johnson Residence',
    ownerEmail: 'mike@example.com',
    memberCount: 3,
    plan: 'basic',
    status: 'active',
    createdAt: '2024-02-15T00:00:00Z',
    lastActivityAt: getDate(-2, 12),
  },
  {
    id: '3',
    name: 'Doe Family',
    ownerEmail: 'jane@example.com',
    memberCount: 2,
    plan: 'free',
    status: 'inactive',
    createdAt: '2024-03-01T00:00:00Z',
    lastActivityAt: getDate(-30, 8),
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Smith',
    action: 'LOGIN',
    resource: 'auth',
    ipAddress: '192.168.1.100',
    timestamp: getDate(0, 8),
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Smith',
    action: 'CREATE',
    resource: 'task',
    resourceId: '15',
    details: 'Created task: "Buy groceries"',
    ipAddress: '192.168.1.101',
    timestamp: getDate(0, 9),
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Smith',
    action: 'UPDATE',
    resource: 'household',
    resourceId: '1',
    details: 'Updated household settings',
    ipAddress: '192.168.1.100',
    timestamp: getDate(0, 10),
  },
  {
    id: '4',
    userId: '4',
    userName: 'System Admin',
    action: 'SUSPEND',
    resource: 'user',
    resourceId: '6',
    details: 'Suspended user: Jane Doe',
    ipAddress: '10.0.0.1',
    timestamp: getDate(-1, 14),
  },
  {
    id: '5',
    userId: '5',
    userName: 'Mike Johnson',
    action: 'CREATE',
    resource: 'event',
    resourceId: '20',
    details: 'Created event: "Family BBQ"',
    ipAddress: '192.168.2.50',
    timestamp: getDate(-2, 11),
  },
  {
    id: '6',
    userId: '2',
    userName: 'Sarah Smith',
    action: 'DELETE',
    resource: 'inventory',
    resourceId: '45',
    details: 'Deleted inventory item: "Expired milk"',
    ipAddress: '192.168.1.101',
    timestamp: getDate(-1, 16),
  },
  {
    id: '7',
    userId: '1',
    userName: 'John Smith',
    action: 'INVITE',
    resource: 'member',
    details: 'Invited grandma@email.com to household',
    ipAddress: '192.168.1.100',
    timestamp: getDate(-3, 20),
  },
];

export const mockStats: SystemStats = {
  totalUsers: 156,
  activeUsers: 142,
  totalHouseholds: 45,
  activeHouseholds: 41,
  newUsersThisMonth: 12,
  newHouseholdsThisMonth: 3,
};

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUsers(): Promise<SystemUser[]> {
  await delay(300);
  return mockUsers;
}

export async function getHouseholds(): Promise<SystemHousehold[]> {
  await delay(300);
  return mockHouseholds;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  await delay(300);
  return mockAuditLogs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function getStats(): Promise<SystemStats> {
  await delay(300);
  return mockStats;
}

export async function updateUserStatus(
  userId: string,
  status: SystemUser['status']
): Promise<SystemUser> {
  await delay(500);
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  user.status = status;
  return user;
}

export async function updateHouseholdStatus(
  householdId: string,
  status: SystemHousehold['status']
): Promise<SystemHousehold> {
  await delay(500);
  const household = mockHouseholds.find(h => h.id === householdId);
  if (!household) throw new Error('Household not found');
  household.status = status;
  return household;
}
