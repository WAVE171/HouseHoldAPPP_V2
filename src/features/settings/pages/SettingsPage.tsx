import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PreferencesSettings } from '../components/PreferencesSettings';
import { NotificationSettings } from '../components/NotificationSettings';
import { PrivacySettings } from '../components/PrivacySettings';
import { SecuritySettings } from '../components/SecuritySettings';
import type {
  UserPreferences,
  NotificationSettings as NotificationSettingsType,
  PrivacySettings as PrivacySettingsType,
  SecuritySettings as SecuritySettingsType,
} from '../types/settings.types';
import {
  mockPreferences,
  mockNotificationSettings,
  mockPrivacySettings,
  mockSecuritySettings,
  updatePreferences,
  updateNotificationSettings,
  updatePrivacySettings,
  enableTwoFactor,
  disableTwoFactor,
  removeDevice,
  changePassword,
} from '@/mocks/settings';

export function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsType | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setPreferences({ ...mockPreferences });
      setNotificationSettings({ ...mockNotificationSettings });
      setPrivacySettings({ ...mockPrivacySettings });
      setSecuritySettings({ ...mockSecuritySettings });
      setIsLoading(false);
    }, 300);
  }, []);

  const handleUpdatePreferences = async (updates: Partial<UserPreferences>) => {
    const updated = await updatePreferences(updates);
    setPreferences({ ...updated });
  };

  const handleUpdateNotifications = async (updates: Partial<NotificationSettingsType>) => {
    const updated = await updateNotificationSettings(updates);
    setNotificationSettings({ ...updated });
  };

  const handleUpdatePrivacy = async (updates: Partial<PrivacySettingsType>) => {
    const updated = await updatePrivacySettings(updates);
    setPrivacySettings({ ...updated });
  };

  const handleEnableTwoFactor = async () => {
    const result = await enableTwoFactor();
    setSecuritySettings(prev => prev ? { ...prev, twoFactorEnabled: true } : null);
    return result;
  };

  const handleDisableTwoFactor = async () => {
    await disableTwoFactor();
    setSecuritySettings(prev => prev ? { ...prev, twoFactorEnabled: false } : null);
  };

  const handleRemoveDevice = async (deviceId: string) => {
    await removeDevice(deviceId);
    setSecuritySettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        trustedDevices: prev.trustedDevices.filter(d => d.id !== deviceId),
      };
    });
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await changePassword(currentPassword, newPassword);
  };

  if (isLoading || !preferences || !notificationSettings || !privacySettings || !securitySettings) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <PreferencesSettings
            preferences={preferences}
            onUpdate={handleUpdatePreferences}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            settings={notificationSettings}
            onUpdate={handleUpdateNotifications}
          />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings
            settings={privacySettings}
            onUpdate={handleUpdatePrivacy}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings
            settings={securitySettings}
            onEnableTwoFactor={handleEnableTwoFactor}
            onDisableTwoFactor={handleDisableTwoFactor}
            onRemoveDevice={handleRemoveDevice}
            onChangePassword={handleChangePassword}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
