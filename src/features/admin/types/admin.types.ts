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
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Subscription Management
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

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  invoiceUrl?: string;
  paidAt?: string;
  createdAt: string;
}

export interface SubscriptionWithPayments extends Subscription {
  payments: Payment[];
}

export interface UpdateSubscriptionData {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  endDate?: string;
  trialEndsAt?: string;
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

// Plan configuration
export interface PlanConfig {
  plan: SubscriptionPlan;
  name: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  maxMembers: number;
  maxHouseholds: number;
}

export const PLAN_CONFIGS: PlanConfig[] = [
  {
    plan: 'FREE',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    features: ['1 household', '3 members', 'Basic features'],
    maxMembers: 3,
    maxHouseholds: 1,
  },
  {
    plan: 'BASIC',
    name: 'Basic',
    price: 9.99,
    yearlyPrice: 99.99,
    features: ['1 household', '10 members', 'All features', 'Email support'],
    maxMembers: 10,
    maxHouseholds: 1,
  },
  {
    plan: 'PREMIUM',
    name: 'Premium',
    price: 19.99,
    yearlyPrice: 199.99,
    features: ['1 household', 'Unlimited members', 'All features', 'Priority support'],
    maxMembers: -1,
    maxHouseholds: 1,
  },
  {
    plan: 'ENTERPRISE',
    name: 'Enterprise',
    price: 49.99,
    yearlyPrice: 499.99,
    features: ['Multiple households', 'Unlimited members', 'API access', 'Dedicated support'],
    maxMembers: -1,
    maxHouseholds: -1,
  },
];

// System Settings
export interface SystemSettings {
  siteName: string;
  supportEmail: string;
  defaultTrialDays: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number; // in minutes
  emailNotificationsEnabled: boolean;
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
