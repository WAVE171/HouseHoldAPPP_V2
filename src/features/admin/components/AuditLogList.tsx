import { format } from 'date-fns';
import {
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  UserMinus,
  Shield,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import type { AuditLog } from '../types/admin.types';

interface AuditLogListProps {
  logs: AuditLog[];
}

const actionIcons: Record<string, React.ElementType> = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  SUSPEND: UserMinus,
  INVITE: Mail,
};

const actionColors: Record<string, string> = {
  LOGIN: 'bg-blue-100 text-blue-700',
  LOGOUT: 'bg-gray-100 text-gray-700',
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
  SUSPEND: 'bg-red-100 text-red-700',
  INVITE: 'bg-purple-100 text-purple-700',
};

export function AuditLogList({ logs }: AuditLogListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {logs.map(log => {
              const Icon = actionIcons[log.action] || Shield;
              const colorClass = actionColors[log.action] || 'bg-gray-100 text-gray-700';

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 border rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.userName}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {log.resource}
                      </Badge>
                    </div>
                    {log.details && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {log.details}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {format(new Date(log.timestamp), 'MMM d, yyyy h:mm:ss a')}
                      </span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
