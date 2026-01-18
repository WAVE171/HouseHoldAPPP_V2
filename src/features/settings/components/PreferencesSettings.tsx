import { useState } from 'react';
import { Sun, Moon, Monitor, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { UserPreferences } from '../types/settings.types';

interface PreferencesSettingsProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (\u20AC)' },
  { value: 'GBP', label: 'GBP (\u00A3)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
];

export function PreferencesSettings({ preferences, onUpdate }: PreferencesSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleChange = (key: keyof UserPreferences, value: string) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(localPrefs);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = JSON.stringify(localPrefs) !== JSON.stringify(preferences);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your app experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme */}
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex gap-2">
            {[
              { value: 'light', icon: Sun, label: 'Light' },
              { value: 'dark', icon: Moon, label: 'Dark' },
              { value: 'system', icon: Monitor, label: 'System' },
            ].map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={localPrefs.theme === value ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handleChange('theme', value)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={localPrefs.language} onValueChange={(v) => handleChange('language', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={localPrefs.timezone} onValueChange={(v) => handleChange('timezone', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map(tz => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date & Time Format */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select value={localPrefs.dateFormat} onValueChange={(v) => handleChange('dateFormat', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map(fmt => (
                  <SelectItem key={fmt.value} value={fmt.value}>
                    {fmt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Format</Label>
            <Select value={localPrefs.timeFormat} onValueChange={(v) => handleChange('timeFormat', v as '12h' | '24h')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                <SelectItem value="24h">24-hour (13:30)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select value={localPrefs.currency} onValueChange={(v) => handleChange('currency', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(curr => (
                <SelectItem key={curr.value} value={curr.value}>
                  {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              'Save Preferences'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
