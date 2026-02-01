import { useState } from 'react';
import { format } from 'date-fns';
import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
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
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import type { SystemUser, AdminUserRole } from '../types/admin.types';

interface UserManagementProps {
  users: SystemUser[];
  onUpdateStatus: (userId: string, isLocked: boolean) => void;
  showHousehold?: boolean;
}

const roleColors: Record<AdminUserRole, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-red-100 text-red-700',
  PARENT: 'bg-blue-100 text-blue-700',
  MEMBER: 'bg-green-100 text-green-700',
  STAFF: 'bg-orange-100 text-orange-700',
};

export function UserManagement({ users, onUpdateStatus, showHousehold = false }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower) ||
      user.householdName?.toLowerCase().includes(searchLower)
    );
  });

  const getUserStatus = (user: SystemUser): { label: string; color: string } => {
    if (user.isLocked) {
      return { label: 'Locked', color: 'bg-red-100 text-red-700' };
    }
    return { label: 'Active', color: 'bg-green-100 text-green-700' };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              {showHousehold && <TableHead>Household</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => {
              const status = getUserStatus(user);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.avatar && <AvatarImage src={user.avatar} />}
                        <AvatarFallback>
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                          {(user.lastName?.[0] || '').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs', roleColors[user.role])}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  {showHousehold && (
                    <TableCell>
                      {user.householdName || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge className={cn('text-xs', status.color)}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt ? (
                      format(new Date(user.lastLoginAt), 'MMM d, yyyy h:mm a')
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.isLocked ? (
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(user.id, false)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Unlock
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onUpdateStatus(user.id, true)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Lock
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <p>No users found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
