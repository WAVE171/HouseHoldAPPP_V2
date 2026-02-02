import { AlertTriangle, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';

interface SuspensionBannerProps {
  reason?: string;
  supportEmail?: string;
}

export function SuspensionBanner({ reason, supportEmail = 'support@householdhero.com' }: SuspensionBannerProps) {
  return (
    <Alert variant="destructive" className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold">Account Suspended</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">
          Your household account is currently suspended and in read-only mode.
          You can view all your data, but cannot make any changes (create, update, or delete).
        </p>
        {reason && (
          <p className="text-sm">
            <span className="font-medium">Reason:</span> {reason}
          </p>
        )}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${supportEmail}`}>
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
