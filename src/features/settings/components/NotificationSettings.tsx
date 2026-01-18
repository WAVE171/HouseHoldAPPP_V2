import { useState } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import type { NotificationSettings as NotificationSettingsType } from '../types/settings.types';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: Partial<NotificationSettingsType>) => Promise<void>;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key: keyof NotificationSettingsType) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(localSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Channels */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notification Channels</h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="email" className="cursor-pointer">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email"
              checked={localSettings.email}
              onCheckedChange={() => handleToggle('email')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="push" className="cursor-pointer">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
              </div>
            </div>
            <Switch
              id="push"
              checked={localSettings.push}
              onCheckedChange={() => handleToggle('push')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="sms" className="cursor-pointer">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive text message alerts</p>
              </div>
            </div>
            <Switch
              id="sms"
              checked={localSettings.sms}
              onCheckedChange={() => handleToggle('sms')}
            />
          </div>
        </div>

        <Separator />

        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">What to Notify</h4>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="taskReminders" className="cursor-pointer">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming and overdue tasks</p>
            </div>
            <Switch
              id="taskReminders"
              checked={localSettings.taskReminders}
              onCheckedChange={() => handleToggle('taskReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="eventReminders" className="cursor-pointer">Event Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified before calendar events</p>
            </div>
            <Switch
              id="eventReminders"
              checked={localSettings.eventReminders}
              onCheckedChange={() => handleToggle('eventReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="billReminders" className="cursor-pointer">Bill Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming bills</p>
            </div>
            <Switch
              id="billReminders"
              checked={localSettings.billReminders}
              onCheckedChange={() => handleToggle('billReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="inventoryAlerts" className="cursor-pointer">Inventory Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about low stock items</p>
            </div>
            <Switch
              id="inventoryAlerts"
              checked={localSettings.inventoryAlerts}
              onCheckedChange={() => handleToggle('inventoryAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weeklyDigest" className="cursor-pointer">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Receive a weekly summary email</p>
            </div>
            <Switch
              id="weeklyDigest"
              checked={localSettings.weeklyDigest}
              onCheckedChange={() => handleToggle('weeklyDigest')}
            />
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Notification Settings'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
