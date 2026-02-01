import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { AdminStatsCards } from '../components/AdminStatsCards';
import { UserManagement } from '../components/UserManagement';
import { AuditLogList } from '../components/AuditLogList';
import { HouseholdManagement } from '../components/HouseholdManagement';
import { useRole } from '@/shared/hooks/useRole';
import { adminApi } from '@/shared/api/admin.api';
import { useToast } from '@/shared/hooks/use-toast';
import type {
  SystemUser,
  AuditLog,
  SystemStats,
} from '../types/admin.types';

export function AdminPage() {
  const { isSuperAdmin, canViewAdminPanel } = useRole();
  const { toast } = useToast();
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
      // Fetch stats based on role
      const statsData = isSuperAdmin
        ? await adminApi.getSystemStats()
        : await adminApi.getHouseholdStats();
      setStats(statsData);

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

  if (!canViewAdminPanel) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          {isSuperAdmin
            ? 'System-wide administration and monitoring.'
            : 'Household administration and monitoring.'}
        </p>
      </div>

      {/* Stats */}
      <AdminStatsCards stats={stats} />

      {/* Main Content */}
      <Tabs defaultValue={isSuperAdmin ? 'households' : 'users'} className="space-y-4">
        <TabsList>
          {isSuperAdmin && (
            <TabsTrigger value="households">Households</TabsTrigger>
          )}
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {isSuperAdmin && (
          <TabsContent value="households">
            <HouseholdManagement />
          </TabsContent>
        )}

        <TabsContent value="users">
          <UserManagement
            users={users}
            onUpdateStatus={handleUpdateUserStatus}
            showHousehold={isSuperAdmin}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogList logs={auditLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
