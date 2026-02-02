import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '../types/auth.types';
import { authApi } from '@/shared/api';

interface ImpersonationState {
  isImpersonating: boolean;
  originalToken: string | null;
  originalUser: User | null;
  impersonationLogId: string | null;
  targetUser: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    householdId?: string;
    householdName?: string;
  } | null;
}

interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Impersonation state
  impersonation: ImpersonationState;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;

  // Impersonation actions
  startImpersonation: (
    impersonationToken: string,
    targetUser: ImpersonationState['targetUser'],
    impersonationLogId: string
  ) => void;
  endImpersonation: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Impersonation initial state
      impersonation: {
        isImpersonating: false,
        originalToken: null,
        originalUser: null,
        impersonationLogId: null,
        targetUser: null,
      },

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(credentials.email, credentials.password);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      // Register action
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.register({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            householdName: data.householdName,
          });

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });

        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set user (for profile updates)
      setUser: (user: User) => {
        set({ user });
      },

      // Start impersonation - save original state and switch to target user
      startImpersonation: (impersonationToken, targetUser, impersonationLogId) => {
        const currentState = get();
        set({
          impersonation: {
            isImpersonating: true,
            originalToken: currentState.token,
            originalUser: currentState.user,
            impersonationLogId,
            targetUser,
          },
          token: impersonationToken,
          user: targetUser ? {
            id: targetUser.id,
            email: targetUser.email,
            role: targetUser.role as User['role'],
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            householdId: targetUser.householdId,
            createdAt: new Date().toISOString(),
          } : null,
        });
      },

      // End impersonation - restore original state
      endImpersonation: () => {
        const { impersonation } = get();
        if (impersonation.isImpersonating) {
          set({
            token: impersonation.originalToken,
            user: impersonation.originalUser,
            impersonation: {
              isImpersonating: false,
              originalToken: null,
              originalUser: null,
              impersonationLogId: null,
              targetUser: null,
            },
          });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        impersonation: state.impersonation,
      }),
    }
  )
);
