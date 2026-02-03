import apiClient, { getApiErrorMessage } from './client';
import type { User, AuthResponse } from '@/features/auth/types/auth.types';

// Enable mock mode when API is unavailable (for frontend-only development)
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || true; // Default to mock mode

// Mock users for testing
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@example.com': {
    password: 'password123',
    user: {
      id: 'user-1',
      email: 'admin@example.com',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      householdId: 'household-1',
      createdAt: new Date().toISOString(),
    },
  },
  'superadmin@example.com': {
    password: 'password123',
    user: {
      id: 'user-super',
      email: 'superadmin@example.com',
      role: 'SUPER_ADMIN',
      firstName: 'Super',
      lastName: 'Admin',
      createdAt: new Date().toISOString(),
    },
  },
  'parent@example.com': {
    password: 'password123',
    user: {
      id: 'user-2',
      email: 'parent@example.com',
      role: 'PARENT',
      firstName: 'Parent',
      lastName: 'User',
      householdId: 'household-1',
      createdAt: new Date().toISOString(),
    },
  },
  'member@example.com': {
    password: 'password123',
    user: {
      id: 'user-3',
      email: 'member@example.com',
      role: 'MEMBER',
      firstName: 'Family',
      lastName: 'Member',
      householdId: 'household-1',
      createdAt: new Date().toISOString(),
    },
  },
};

// Generate mock token
function generateMockToken(): string {
  return 'mock-jwt-token-' + Math.random().toString(36).substring(2);
}

// API response types (matching backend DTOs)
interface ApiTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    householdId?: string;
    householdName?: string;
  };
}

// Transform API response to frontend format
function transformAuthResponse(apiResponse: ApiTokenResponse): AuthResponse {
  return {
    user: {
      id: apiResponse.user.id,
      email: apiResponse.user.email,
      role: apiResponse.user.role as User['role'],
      firstName: apiResponse.user.firstName,
      lastName: apiResponse.user.lastName,
      avatar: apiResponse.user.avatar,
      householdId: apiResponse.user.householdId,
      createdAt: new Date().toISOString(),
    },
    token: apiResponse.accessToken,
    refreshToken: apiResponse.refreshToken,
  };
}

export const authApi = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Use mock authentication for frontend-only development
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      const mockUser = MOCK_USERS[email.toLowerCase()];
      if (mockUser && mockUser.password === password) {
        return {
          user: mockUser.user,
          token: generateMockToken(),
          refreshToken: generateMockToken(),
        };
      }
      throw new Error('Invalid email or password');
    }

    try {
      const response = await apiClient.post<ApiTokenResponse>('/auth/login', {
        email,
        password,
      });
      return transformAuthResponse(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Register a new user and create household
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    householdName?: string;
  }): Promise<AuthResponse> {
    // Use mock registration for frontend-only development
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      const newUser: User = {
        id: 'user-' + Date.now(),
        email: data.email,
        role: 'ADMIN',
        firstName: data.firstName,
        lastName: data.lastName,
        householdId: 'household-' + Date.now(),
        createdAt: new Date().toISOString(),
      };

      // Add to mock users for this session
      MOCK_USERS[data.email.toLowerCase()] = {
        password: data.password,
        user: newUser,
      };

      return {
        user: newUser,
        token: generateMockToken(),
        refreshToken: generateMockToken(),
      };
    }

    try {
      const response = await apiClient.post<ApiTokenResponse>('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        householdName: data.householdName || `${data.firstName}'s Household`,
        role: 'ADMIN', // First user is always admin
      });
      return transformAuthResponse(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      // In mock mode, just return a new token
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.user) {
          return {
            user: state.user,
            token: generateMockToken(),
            refreshToken: generateMockToken(),
          };
        }
      }
      throw new Error('Session expired');
    }

    try {
      const response = await apiClient.post<ApiTokenResponse>('/auth/refresh', {
        refreshToken,
      });
      return transformAuthResponse(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Logout - invalidate token on server
   */
  async logout(): Promise<void> {
    if (USE_MOCK_AUTH) {
      return; // Nothing to do in mock mode
    }

    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors - we'll clear local state anyway
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    if (USE_MOCK_AUTH) {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.user) {
          return state.user;
        }
      }
      throw new Error('Not authenticated');
    }

    try {
      const response = await apiClient.get<User>('/users/me');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    try {
      const response = await apiClient.post<{ message: string }>('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string, confirmPassword: string): Promise<{ message: string }> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      return { message: 'Password has been reset successfully. You can now log in with your new password.' };
    }

    try {
      const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
        token,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default authApi;
