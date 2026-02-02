import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarInset,
} from '@/shared/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { SuspensionBanner } from '@/features/admin/components/SuspensionBanner';
import { ImpersonationBanner } from '@/features/admin/components/ImpersonationBanner';
import { useAuthStore } from '@/features/auth/store/authStore';
import { adminApi } from '@/shared/api/admin.api';
import { useToast } from '@/shared/hooks/use-toast';

export function MainLayout() {
  const { user, impersonation, endImpersonation } = useAuthStore();
  const { toast } = useToast();
  const [isEndingImpersonation, setIsEndingImpersonation] = useState(false);

  const isSuspended = user?.householdStatus === 'SUSPENDED';
  const isImpersonating = impersonation.isImpersonating;

  const handleEndImpersonation = async () => {
    if (!impersonation.impersonationLogId) return;

    setIsEndingImpersonation(true);
    try {
      await adminApi.endImpersonation(impersonation.impersonationLogId);
      endImpersonation();
      toast({
        title: 'Impersonation Ended',
        description: 'You are now back to your Super Admin account.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to end impersonation',
        variant: 'destructive',
      });
    } finally {
      setIsEndingImpersonation(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        <main className="flex-1 p-6">
          {isImpersonating && impersonation.targetUser && (
            <ImpersonationBanner
              targetUserName={`${impersonation.targetUser.firstName} ${impersonation.targetUser.lastName}`}
              targetUserEmail={impersonation.targetUser.email}
              targetUserRole={impersonation.targetUser.role}
              onEndImpersonation={handleEndImpersonation}
              isEnding={isEndingImpersonation}
            />
          )}
          {isSuspended && !isImpersonating && <SuspensionBanner />}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
