export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';
  householdId: string;
  householdName: string;
  joinedAt: string;
  lastActive: string;
}

export interface UserActivity {
  id: string;
  type: 'task_completed' | 'event_created' | 'item_added' | 'expense_added' | 'login';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface UserStats {
  tasksCompleted: number;
  tasksAssigned: number;
  eventsCreated: number;
  recipesAdded: number;
  inventoryItems: number;
  totalExpenses: number;
}
