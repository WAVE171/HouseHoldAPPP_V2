import type { UserProfile, UserActivity, UserStats } from '@/features/profile/types/profile.types';

export const mockProfile: UserProfile = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  avatar: undefined,
  bio: 'Busy parent managing the household and keeping everything organized.',
  dateOfBirth: '1985-06-15',
  address: {
    street: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    country: 'United States',
  },
  role: 'PARENT',
  householdId: '1',
  householdName: 'Smith Family',
  joinedAt: '2024-01-15T10:00:00Z',
  lastActive: new Date().toISOString(),
};

export const mockActivities: UserActivity[] = [
  {
    id: '1',
    type: 'task_completed',
    description: 'Completed task "Weekly grocery shopping"',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'event_created',
    description: 'Created event "Family dinner"',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'expense_added',
    description: 'Added expense "$150 for groceries"',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'item_added',
    description: 'Added 5 items to inventory',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'login',
    description: 'Logged in from MacBook Pro',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'task_completed',
    description: 'Completed task "Pay electric bill"',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    type: 'event_created',
    description: 'Created event "Doctor appointment"',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockStats: UserStats = {
  tasksCompleted: 47,
  tasksAssigned: 12,
  eventsCreated: 23,
  recipesAdded: 8,
  inventoryItems: 156,
  totalExpenses: 3250.75,
};

// Mock API functions
export async function updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  await new Promise(resolve => setTimeout(resolve, 500));
  Object.assign(mockProfile, updates);
  return { ...mockProfile };
}

export async function uploadAvatar(file: File): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const url = URL.createObjectURL(file);
  mockProfile.avatar = url;
  return url;
}

export async function deleteAccount(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Mock account deletion
}
