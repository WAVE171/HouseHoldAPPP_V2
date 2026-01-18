import { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { PrivacySettings as PrivacySettingsType } from '../types/settings.types';

interface PrivacySettingsProps {
  settings: PrivacySettingsType;
  onUpdate: (settings: Partial<PrivacySettingsType>) => Promise<void>;
}

export function PrivacySettings({ settings, onUpdate }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key: keyof PrivacySettingsType) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVisibilityChange = (value: 'public' | 'household' | 'private') => {
    setLocalSettings(prev => ({ ...prev, profileVisibility: value }));
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
          <Shield className="h-5 w-5" />
          Privacy
        </CardTitle>
        <CardDescription>Control your privacy and visibility settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-2">
          <Label>Profile Visibility</Label>
          <Select
            value={localSettings.profileVisibility}
            onValueChange={handleVisibilityChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex flex-col">
                  <span>Public</span>
                  <span className="text-xs text-muted-foreground">Anyone can see your profile</span>
                </div>
              </SelectItem>
              <SelectItem value="household">
                <div className="flex flex-col">
                  <span>Household Only</span>
                  <span className="text-xs text-muted-foreground">Only household members</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex flex-col">
                  <span>Private</span>
                  <span className="text-xs text-muted-foreground">Only you can see your profile</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Status */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="activityStatus" className="cursor-pointer">Show Activity Status</Label>
            <p className="text-sm text-muted-foreground">
              Let others see when you're online
            </p>
          </div>
          <Switch
            id="activityStatus"
            checked={localSettings.showActivityStatus}
            onCheckedChange={() => handleToggle('showActivityStatus')}
          />
        </div>

        {/* Allow Invitations */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="allowInvitations" className="cursor-pointer">Allow Invitations</Label>
            <p className="text-sm text-muted-foreground">
              Allow others to invite you to their households
            </p>
          </div>
          <Switch
            id="allowInvitations"
            checked={localSettings.allowInvitations}
            onCheckedChange={() => handleToggle('allowInvitations')}
          />
        </div>

        {/* Share Calendar */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="shareCalendar" className="cursor-pointer">Share Calendar</Label>
            <p className="text-sm text-muted-foreground">
              Share your calendar with household members
            </p>
          </div>
          <Switch
            id="shareCalendar"
            checked={localSettings.shareCalendar}
            onCheckedChange={() => handleToggle('shareCalendar')}
          />
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
              'Save Privacy Settings'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
