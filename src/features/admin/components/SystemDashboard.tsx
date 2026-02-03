import { useState, useEffect } from 'react';
import {
  Users,
  Home,
  Activity,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  Building,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { adminApi } from '@/shared/api/admin.api';
import type { EnhancedSystemStats } from '../types/admin.types';

interface SystemDashboardProps {
  onCreateHousehold?: () => void;
  onCreateUser?: () => void;
}

export function SystemDashboard({ onCreateHousehold, onCreateUser }: SystemDashboardProps) {
  const { toast } = useToast();
  const [stats, setStats] = useState<EnhancedSystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getEnhancedSystemStats();
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load system stats',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Overview</h2>
          <p className="text-muted-foreground">Platform health and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {onCreateHousehold && (
            <Button variant="outline" onClick={onCreateHousehold}>
              <Building className="h-4 w-4 mr-2" />
              New Household
            </Button>
          )}
          {onCreateUser && (
            <Button onClick={onCreateUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              New User
            </Button>
          )}
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Households</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHouseholds}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="text-xs">
                {stats.activeHouseholds} active
              </Badge>
              {stats.suspendedHouseholds > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.suspendedHouseholds} suspended
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">{stats.activeUsersLast24h}</span> active in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{stats.newUsersLast7Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              New user signups (7 days)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Households</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">+{stats.newHouseholdsLast30Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Created in last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Subscription Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Activity Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Household Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Active (30 days)</span>
                </div>
                <span className="font-medium">{stats.activeHouseholds}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Inactive</span>
                </div>
                <span className="font-medium">{stats.inactiveHouseholds}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Suspended</span>
                </div>
                <span className="font-medium">{stats.suspendedHouseholds}</span>
              </div>

              {/* Progress bar visualization */}
              <div className="h-2 flex rounded-full overflow-hidden bg-muted">
                <div
                  className="bg-green-500"
                  style={{ width: `${(stats.activeHouseholds / stats.totalHouseholds) * 100}%` }}
                />
                <div
                  className="bg-yellow-500"
                  style={{ width: `${(stats.inactiveHouseholds / stats.totalHouseholds) * 100}%` }}
                />
                <div
                  className="bg-red-500"
                  style={{ width: `${(stats.suspendedHouseholds / stats.totalHouseholds) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Free</Badge>
                </div>
                <span className="font-medium">{stats.subscriptionsByPlan.FREE}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Basic</Badge>
                </div>
                <span className="font-medium">{stats.subscriptionsByPlan.BASIC}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500">Premium</Badge>
                </div>
                <span className="font-medium">{stats.subscriptionsByPlan.PREMIUM}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-500">Enterprise</Badge>
                </div>
                <span className="font-medium">{stats.subscriptionsByPlan.ENTERPRISE}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {stats.suspendedHouseholds > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-yellow-600">{stats.suspendedHouseholds} household(s)</span> are currently suspended.
              Review and take action in the Households tab.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
