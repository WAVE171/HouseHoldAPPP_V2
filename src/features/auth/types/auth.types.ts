export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';
export type HouseholdStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  householdId?: string;
  householdStatus?: HouseholdStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  // Step 1: Account
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  phone?: string;
  // Step 3: Household
  householdOption: 'create' | 'join';
  householdName?: string;
  inviteCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
