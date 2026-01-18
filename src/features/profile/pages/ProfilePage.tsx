import { useState, useEffect } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileStats } from '../components/ProfileStats';
import { ProfileInfo } from '../components/ProfileInfo';
import { ActivityFeed } from '../components/ActivityFeed';
import type { UserProfile, UserActivity, UserStats } from '../types/profile.types';
import {
  mockProfile,
  mockActivities,
  mockStats,
  updateProfile,
  uploadAvatar,
} from '@/mocks/profile';

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setProfile({ ...mockProfile });
      setActivities([...mockActivities]);
      setStats({ ...mockStats });
      setIsLoading(false);
    }, 300);
  }, []);

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await updateProfile(updates);
    setProfile({ ...updated });
  };

  const handleUploadAvatar = async (file: File) => {
    const avatarUrl = await uploadAvatar(file);
    setProfile(prev => prev ? { ...prev, avatar: avatarUrl } : null);
    return avatarUrl;
  };

  if (isLoading || !profile || !stats) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader profile={profile} onUploadAvatar={handleUploadAvatar} />

      <ProfileStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileInfo profile={profile} onUpdate={handleUpdateProfile} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
