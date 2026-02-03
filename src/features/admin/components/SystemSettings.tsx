import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import {
  Settings,
  Mail,
  Shield,
  Clock,
  Bell,
  Save,
  RotateCcw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { adminApi, type SystemSettings as SystemSettingsType } from '@/shared/api/admin.api';

const defaultSettings: SystemSettingsType = {
  siteName: 'Household Hero',
  supportEmail: 'support@householdhero.com',
  defaultTrialDays: 14,
  maintenanceMode: false,
  registrationEnabled: true,
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  emailNotificationsEnabled: true,
};

export function SystemSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettingsType>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<SystemSettingsType>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Check if settings have changed
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSystemSettings();
      setSettings(data);
      setOriginalSettings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load system settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = await adminApi.updateSystemSettings(settings);
      setOriginalSettings(updatedSettings);
      toast({
        title: 'Settings saved',
        description: 'System settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save system settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    toast({
      title: 'Changes discarded',
      description: 'Settings have been reset to their previous values.',
    });
  };

  const updateSetting = <K extends keyof SystemSettingsType>(
    key: K,
    value: SystemSettingsType[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">
            Configure platform-wide settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Discard Changes
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Maintenance Mode Warning */}
      {settings.maintenanceMode && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">
              Maintenance mode is enabled. Users cannot access the platform.
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic platform configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting('supportEmail', e.target.value)}
                placeholder="support@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trialDays">Default Trial Period (days)</Label>
              <Input
                id="trialDays"
                type="number"
                min={0}
                max={90}
                value={settings.defaultTrialDays}
                onChange={(e) => updateSetting('defaultTrialDays', parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Authentication and security configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min={1}
                max={10}
                value={settings.maxLoginAttempts}
                onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-muted-foreground">
                Account will be locked after this many failed attempts
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min={5}
                max={1440}
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 30)}
              />
              <p className="text-xs text-muted-foreground">
                Users will be logged out after this period of inactivity
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Registration Enabled</Label>
                <p className="text-xs text-muted-foreground">
                  Allow new users to register
                </p>
              </div>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure email and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Send system emails (welcome, password reset, etc.)
                </p>
              </div>
              <Switch
                checked={settings.emailNotificationsEnabled}
                onCheckedChange={(checked) => updateSetting('emailNotificationsEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Maintenance
            </CardTitle>
            <CardDescription>
              System maintenance configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Prevent users from accessing the platform
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
              />
            </div>
            {settings.maintenanceMode && (
              <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                <Mail className="inline h-4 w-4 mr-1" />
                Consider sending a notification to users before enabling maintenance mode.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan Configuration - Read Only Display */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>
            Current plan configuration (read-only preview)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="font-semibold">Free</div>
              <div className="text-2xl font-bold">$0</div>
              <div className="text-sm text-muted-foreground">per month</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 1 household</li>
                <li>• 3 members</li>
                <li>• Basic features</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-semibold">Basic</div>
              <div className="text-2xl font-bold">$9.99</div>
              <div className="text-sm text-muted-foreground">per month</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 1 household</li>
                <li>• 10 members</li>
                <li>• All features</li>
              </ul>
            </div>
            <div className="rounded-lg border border-primary p-4 bg-primary/5">
              <div className="font-semibold text-primary">Premium</div>
              <div className="text-2xl font-bold">$19.99</div>
              <div className="text-sm text-muted-foreground">per month</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 1 household</li>
                <li>• Unlimited members</li>
                <li>• Priority support</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-semibold">Enterprise</div>
              <div className="text-2xl font-bold">Custom</div>
              <div className="text-sm text-muted-foreground">contact sales</div>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Multiple households</li>
                <li>• API access</li>
                <li>• Dedicated support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
