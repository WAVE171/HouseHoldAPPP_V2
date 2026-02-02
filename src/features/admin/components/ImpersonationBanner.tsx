import { Eye, LogOut, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface ImpersonationBannerProps {
  targetUserName: string;
  targetUserEmail: string;
  targetUserRole: string;
  onEndImpersonation: () => void;
  isEnding?: boolean;
}

export function ImpersonationBanner({
  targetUserName,
  targetUserEmail,
  targetUserRole,
  onEndImpersonation,
  isEnding = false,
}: ImpersonationBannerProps) {
  return (
    <Alert className="mb-6 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
      <Eye className="h-5 w-5 text-purple-600" />
      <AlertTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
        Impersonation Mode Active
        <Badge variant="outline" className="border-purple-500 text-purple-700">
          {targetUserRole}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-purple-600" />
              <span className="font-medium">{targetUserName}</span>
              <span className="text-muted-foreground">({targetUserEmail})</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You are viewing the app as this user. All actions will be logged.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEndImpersonation}
            disabled={isEnding}
            className="border-purple-500 text-purple-700 hover:bg-purple-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isEnding ? 'Ending...' : 'End Impersonation'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
