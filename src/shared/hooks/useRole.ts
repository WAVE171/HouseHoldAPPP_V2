import { useAuthStore } from '@/features/auth/store/authStore';
import type { UserRole } from '@/features/auth/types/auth.types';

export function useRole() {
  const { user } = useAuthStore();
  const role = user?.role as UserRole | undefined;

  return {
    role,
    isSuperAdmin: role === 'SUPER_ADMIN',
    isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN',
    isParent: role === 'ADMIN' || role === 'PARENT' || role === 'SUPER_ADMIN',
    isMember: role === 'MEMBER' || role === 'ADMIN' || role === 'PARENT' || role === 'SUPER_ADMIN',
    isStaff: role === 'STAFF',
    canManageHousehold: role === 'ADMIN' || role === 'PARENT' || role === 'SUPER_ADMIN',
    canManageUsers: role === 'ADMIN' || role === 'SUPER_ADMIN',
    canViewAdminPanel: role === 'ADMIN' || role === 'SUPER_ADMIN',
    canManageAllHouseholds: role === 'SUPER_ADMIN',
  };
}

export default useRole;
