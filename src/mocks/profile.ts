// Stub file - API integration pending

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  language: string;
  timezone: string;
  theme: string;
}

export const mockProfile: UserProfile = {
  id: '1',
  email: 'user@example.com',
  firstName: 'User',
  lastName: 'Name',
  language: 'pt-PT',
  timezone: 'Africa/Luanda',
  theme: 'light',
};

export async function getProfile(): Promise<UserProfile> {
  return mockProfile;
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  return { ...mockProfile, ...data };
}

export async function changePassword(_currentPassword: string, _newPassword: string): Promise<{ success: boolean }> {
  throw new Error('API integration required');
}

export async function uploadAvatar(_file: File): Promise<string> {
  throw new Error('API integration required');
}
