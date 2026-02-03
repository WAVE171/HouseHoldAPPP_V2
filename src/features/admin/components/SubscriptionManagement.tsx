import { useState, useEffect } from 'react';
import { Search, CreditCard, RefreshCw, MoreVertical, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import {
  adminApi,
  type Subscription,
  type SubscriptionStats,
  type SubscriptionPlan,
  type SubscriptionStatus,
} from '@/shared/api/admin.api';
import { formatDistanceToNow, format } from 'date-fns';

export function SubscriptionManagement() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit dialog state
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [newPlan, setNewPlan] = useState<SubscriptionPlan>('FREE');
  const [newStatus, setNewStatus] = useState<SubscriptionStatus>('ACTIVE');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getSubscriptions({
        page,
        limit: 20,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter as SubscriptionStatus : undefined,
        plan: planFilter !== 'all' ? planFilter as SubscriptionPlan : undefined,
      });
      setSubscriptions(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load subscriptions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await adminApi.getSubscriptionStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch subscription stats', error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, [page, searchQuery, statusFilter, planFilter]);

  const handleUpdateSubscription = async () => {
    if (!editingSubscription) return;

    setIsUpdating(true);
    try {
      await adminApi.updateSubscription(editingSubscription.id, {
        plan: newPlan,
        status: newStatus,
      });
      toast({
        title: 'Subscription Updated',
        description: `Subscription for "${editingSubscription.householdName}" has been updated`,
      });
      setEditingSubscription(null);
      fetchSubscriptions();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update subscription',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExtendTrial = async (subscription: Subscription) => {
    try {
      await adminApi.extendTrial(subscription.id, 14);
      toast({
        title: 'Trial Extended',
        description: `Trial for "${subscription.householdName}" extended by 14 days`,
      });
      fetchSubscriptions();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to extend trial',
        variant: 'destructive',
      });
    }
  };

  const handleCancelSubscription = async (subscription: Subscription) => {
    try {
      await adminApi.cancelSubscription(subscription.id);
      toast({
        title: 'Subscription Cancelled',
        description: `Subscription for "${subscription.householdName}" has been cancelled`,
      });
      fetchSubscriptions();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel subscription',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setNewPlan(subscription.plan);
    setNewStatus(subscription.status);
  };

  const getStatusBadgeVariant = (status: SubscriptionStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'TRIAL':
        return 'secondary';
      case 'PAST_DUE':
        return 'destructive';
      case 'CANCELLED':
      case 'EXPIRED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPlanBadgeVariant = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'ENTERPRISE':
        return 'default';
      case 'PREMIUM':
        return 'secondary';
      case 'BASIC':
        return 'outline';
      case 'FREE':
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRecurringRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">MRR from active subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.trialSubscriptions} in trial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn This Month</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelledThisMonth}</div>
              <p className="text-xs text-muted-foreground">Cancellations</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Subscriptions by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Free</Badge>
                <span className="text-sm font-medium">{stats.byPlan.FREE}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Basic</Badge>
                <span className="text-sm font-medium">{stats.byPlan.BASIC}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Premium</Badge>
                <span className="text-sm font-medium">{stats.byPlan.PREMIUM}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Enterprise</Badge>
                <span className="text-sm font-medium">{stats.byPlan.ENTERPRISE}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription Management
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => { fetchSubscriptions(); fetchStats(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by household name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="TRIAL">Trial</SelectItem>
                <SelectItem value="PAST_DUE">Past Due</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="FREE">Free</SelectItem>
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <CreditCard className="h-12 w-12 mb-4" />
              <p className="text-lg">No subscriptions found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Trial Ends</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <span className="font-medium">{subscription.householdName}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(subscription.plan)}>
                          {subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ${subscription.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {subscription.billingCycle}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(subscription.startDate), 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        {subscription.trialEndsAt ? (
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(subscription.trialEndsAt), { addSuffix: true })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(subscription)}>
                              Change Plan/Status
                            </DropdownMenuItem>
                            {subscription.status === 'TRIAL' && (
                              <DropdownMenuItem onClick={() => handleExtendTrial(subscription)}>
                                Extend Trial (+14 days)
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {subscription.status !== 'CANCELLED' && (
                              <DropdownMenuItem
                                onClick={() => handleCancelSubscription(subscription)}
                                className="text-destructive"
                              >
                                Cancel Subscription
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Subscription Dialog */}
      <Dialog open={!!editingSubscription} onOpenChange={(open) => !open && setEditingSubscription(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Subscription</DialogTitle>
            <DialogDescription>
              Change plan or status for "{editingSubscription?.householdName}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="plan">Plan</Label>
              <Select value={newPlan} onValueChange={(v) => setNewPlan(v as SubscriptionPlan)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free - $0/mo</SelectItem>
                  <SelectItem value="BASIC">Basic - $9.99/mo</SelectItem>
                  <SelectItem value="PREMIUM">Premium - $19.99/mo</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise - $49.99/mo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as SubscriptionStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="TRIAL">Trial</SelectItem>
                  <SelectItem value="PAST_DUE">Past Due</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubscription(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubscription} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
