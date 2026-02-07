import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
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
  Clock,
  UserCheck,
  Lock,
  ArrowUpRight,
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

      {/* Trends & Activity Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Trends Chart */}
        {stats.trends && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Active Users Chart */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Daily Active Users</span>
                    <span className="text-sm font-medium text-green-600">
                      {stats.trends.activeUsers[stats.trends.activeUsers.length - 1]} today
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {stats.trends.activeUsers.map((value, index) => {
                      const maxValue = Math.max(...stats.trends!.activeUsers);
                      const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-green-500/20 rounded-t relative group"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        >
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t transition-all"
                            style={{ height: '100%' }}
                          />
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {stats.trends.labels.map((label, index) => (
                      <span key={index} className="text-xs text-muted-foreground flex-1 text-center">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* User Signups & Household Creations */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-muted-foreground">User Signups</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {stats.trends.userSignups.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 h-4 bg-blue-500 rounded-sm opacity-20"
                          style={{ opacity: value > 0 ? 0.4 + (value * 0.2) : 0.1 }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium mt-1">
                      {stats.trends.userSignups.reduce((a, b) => a + b, 0)} this week
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="text-xs text-muted-foreground">New Households</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {stats.trends.householdCreations.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 h-4 bg-purple-500 rounded-sm opacity-20"
                          style={{ opacity: value > 0 ? 0.4 + (value * 0.2) : 0.1 }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium mt-1">
                      {stats.trends.householdCreations.reduce((a, b) => a + b, 0)} this week
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity Feed */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.slice(0, 5).map((activity) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case 'USER_REGISTERED':
                        return <UserPlus className="h-4 w-4 text-green-500" />;
                      case 'HOUSEHOLD_CREATED':
                        return <Building className="h-4 w-4 text-blue-500" />;
                      case 'SUBSCRIPTION_CHANGED':
                        return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
                      case 'USER_LOCKED':
                        return <Lock className="h-4 w-4 text-red-500" />;
                      default:
                        return <Activity className="h-4 w-4 text-gray-500" />;
                    }
                  };

                  const getActivityBadge = () => {
                    switch (activity.type) {
                      case 'USER_REGISTERED':
                        return <Badge variant="outline" className="text-green-600 border-green-200">New User</Badge>;
                      case 'HOUSEHOLD_CREATED':
                        return <Badge variant="outline" className="text-blue-600 border-blue-200">New Household</Badge>;
                      case 'SUBSCRIPTION_CHANGED':
                        return <Badge variant="outline" className="text-purple-600 border-purple-200">Subscription</Badge>;
                      case 'USER_LOCKED':
                        return <Badge variant="outline" className="text-red-600 border-red-200">Security</Badge>;
                      default:
                        return null;
                    }
                  };

                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getActivityIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getActivityBadge()}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
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
