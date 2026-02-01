import { useState, useEffect } from 'react';
import { Search, Home, Users, Trash2, Eye, Edit, MoreVertical, RefreshCw } from 'lucide-react';
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
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { adminApi } from '@/shared/api/admin.api';
import type { SystemHousehold, PaginatedResponse } from '@/shared/api/admin.api';
import { AddHouseholdDialog } from './AddHouseholdDialog';
import { HouseholdDetailsDialog } from './HouseholdDetailsDialog';
import { formatDistanceToNow } from 'date-fns';

export function HouseholdManagement() {
  const { toast } = useToast();
  const [households, setHouseholds] = useState<SystemHousehold[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedHousehold, setSelectedHousehold] = useState<SystemHousehold | null>(null);
  const [householdToDelete, setHouseholdToDelete] = useState<SystemHousehold | null>(null);

  const fetchHouseholds = async () => {
    setIsLoading(true);
    try {
      const response: PaginatedResponse<SystemHousehold> = await adminApi.getAllHouseholds(
        page,
        20,
        searchQuery || undefined
      );
      setHouseholds(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load households',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, [page, searchQuery]);

  const handleDeleteHousehold = async () => {
    if (!householdToDelete) return;

    try {
      await adminApi.deleteHousehold(householdToDelete.id);
      toast({
        title: 'Success',
        description: `Household "${householdToDelete.name}" has been deleted`,
      });
      setHouseholdToDelete(null);
      fetchHouseholds();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete household',
        variant: 'destructive',
      });
    }
  };

  const handleHouseholdCreated = () => {
    fetchHouseholds();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Household Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchHouseholds}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <AddHouseholdDialog onHouseholdCreated={handleHouseholdCreated} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search households..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary">{households.length} households</Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : households.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Home className="h-12 w-12 mb-4" />
            <p className="text-lg">No households found</p>
            <p className="text-sm">Create a new household to get started</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {households.map((household) => (
                  <TableRow key={household.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{household.name}</span>
                      </div>
                      {household.address && (
                        <p className="text-xs text-muted-foreground mt-1">{household.address}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{household.adminEmail || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{household.memberCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {household.stats.tasks > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {household.stats.tasks} tasks
                          </Badge>
                        )}
                        {household.stats.vehicles > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {household.stats.vehicles} vehicles
                          </Badge>
                        )}
                        {household.stats.employees > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {household.stats.employees} staff
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(household.createdAt), { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedHousehold(household)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedHousehold(household)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setHouseholdToDelete(household)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!householdToDelete} onOpenChange={() => setHouseholdToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Household</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{householdToDelete?.name}"? This action cannot be
                undone and will delete all associated data including members, tasks, vehicles, and
                more.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteHousehold}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Household Details Dialog */}
        {selectedHousehold && (
          <HouseholdDetailsDialog
            household={selectedHousehold}
            open={!!selectedHousehold}
            onOpenChange={(open) => !open && setSelectedHousehold(null)}
            onUpdate={fetchHouseholds}
          />
        )}
      </CardContent>
    </Card>
  );
}
