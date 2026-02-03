import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { AdminStatsCards } from '../components/AdminStatsCards';
import { UserManagement } from '../components/UserManagement';
import { AuditLogList } from '../components/AuditLogList';
import { HouseholdManagement } from '../components/HouseholdManagement';
import { SystemDashboard } from '../components/SystemDashboard';
import { ImpersonationHistory } from '../components/ImpersonationHistory';
import { useRole } from '@/shared/hooks/useRole';
import { adminApi } from '@/shared/api/admin.api';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '@/features/auth/store/authStore';
import type {
  SystemUser,
  AuditLog,
  SystemStats,
} from '../types/admin.types';

export function AdminPage() {
  const { isSuperAdmin, canViewAdminPanel } = useRole();
  const { toast } = useToast();
  const { startImpersonation } = useAuthStore();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [isSuperAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // For Super Admin, we use the SystemDashboard component which fetches its own data
      // For Household Admin, we still need to fetch stats
      if (!isSuperAdmin) {
        const statsData = await adminApi.getHouseholdStats();
        setStats(statsData);
      }

      // Fetch users
      const usersData = isSuperAdmin
        ? await adminApi.getAllUsersSystemWide()
        : await adminApi.getUsers();
      setUsers(usersData.data || usersData);

      // Fetch audit logs
      const logsData = await adminApi.getAuditLogs({ limit: 50 });
      setAuditLogs(
        [...(logsData.data || logsData)].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId: string, isLocked: boolean) => {
    try {
      if (isLocked) {
        await adminApi.lockUser(userId);
      } else {
        await adminApi.unlockUser(userId);
      }
      // Refresh users
      const usersData = isSuperAdmin
        ? await adminApi.getAllUsersSystemWide()
        : await adminApi.getUsers();
      setUsers(usersData.data || usersData);
      toast({
        title: 'Success',
        description: `User ${isLocked ? 'locked' : 'unlocked'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const result = await adminApi.resetUserPassword(userId);
      toast({
        title: 'Password Reset',
        description: result.tempPassword
          ? `New password: ${result.tempPassword}`
          : 'Password has been reset',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password',
        variant: 'destructive',
      });
    }
  };

  const handleImpersonate = async (userId: string) => {
    try {
      const result = await adminApi.startImpersonation(userId);
      startImpersonation(
        result.impersonationToken,
        result.targetUser,
        result.impersonationLogId
      );
      toast({
        title: 'Impersonation Started',
        description: `You are now viewing as ${result.targetUser.firstName} ${result.targetUser.lastName}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start impersonation',
        variant: 'destructive',
      });
    }
  };

  if (!canViewAdminPanel) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Loading state only for household admin (Super Admin dashboard handles its own loading)
  if (!isSuperAdmin && (isLoading || !stats)) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Super Admin View - System Management Focus
  if (isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground">
            Platform management and monitoring. You are logged in as Super Admin.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="households">Households</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="impersonation">Impersonation</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SystemDashboard />
          </TabsContent>

          <TabsContent value="households">
            <HouseholdManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement
              users={users}
              onUpdateStatus={handleUpdateUserStatus}
              onResetPassword={handleResetPassword}
              onImpersonate={handleImpersonate}
              showHousehold={true}
              showResetPassword={true}
              showImpersonate={true}
            />
          </TabsContent>

          <TabsContent value="impersonation">
            <ImpersonationHistory />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogList logs={auditLogs} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Household Admin View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Household Admin</h1>
        <p className="text-muted-foreground">
          Manage your household settings and members.
        </p>
      </div>

      {/* Stats for Household Admin */}
      {stats && <AdminStatsCards stats={stats} />}

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Members</TabsTrigger>
          <TabsTrigger value="audit">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement
            users={users}
            onUpdateStatus={handleUpdateUserStatus}
            showHousehold={false}
            showResetPassword={false}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogList logs={auditLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
