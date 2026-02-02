import { useAuthStore } from '@/features/auth/store/authStore';
import { useToast } from './use-toast';

/**
 * Hook to check if the current user's household is suspended
 * and provide utilities for handling read-only mode
 */
export function useSuspension() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const isSuspended = user?.householdStatus === 'SUSPENDED';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Super admins are never restricted by suspension
  const isReadOnly = isSuspended && !isSuperAdmin;

  /**
   * Show a toast notification explaining that the action is not allowed
   * because the household is suspended
   */
  const showSuspendedWarning = () => {
    toast({
      title: 'Account Suspended',
      description: 'Your household account is suspended. You cannot make changes until it is reactivated.',
      variant: 'destructive',
    });
  };

  /**
   * Execute an action if not suspended, otherwise show warning
   * @param action - The action to execute
   * @returns true if action was executed, false if blocked
   */
  const guardedAction = <T,>(action: () => T): T | false => {
    if (isReadOnly) {
      showSuspendedWarning();
      return false;
    }
    return action();
  };

  /**
   * Async version of guardedAction
   * @param action - The async action to execute
   * @returns Promise that resolves to result or false if blocked
   */
  const guardedAsyncAction = async <T,>(action: () => Promise<T>): Promise<T | false> => {
    if (isReadOnly) {
      showSuspendedWarning();
      return false;
    }
    return action();
  };

  return {
    isSuspended,
    isReadOnly,
    showSuspendedWarning,
    guardedAction,
    guardedAsyncAction,
  };
}
