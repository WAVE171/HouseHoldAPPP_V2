// Stub file - API integration pending

export interface HouseholdMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';
  avatar?: string;
  phone?: string;
  joinedAt: string;
}

export interface Household {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  members: HouseholdMember[];
  createdAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  invitedAt: string;
  expiresAt: string;
}

export const mockHousehold: Household = {
  id: '1',
  name: 'My Household',
  members: [],
  createdAt: new Date().toISOString(),
};

export const mockMembers: HouseholdMember[] = [];
export const mockInvitations: Invitation[] = [];

export async function getHousehold(): Promise<Household> {
  return mockHousehold;
}

export async function updateHousehold(data: Partial<Household>): Promise<Household> {
  return { ...mockHousehold, ...data };
}

export async function getMembers(): Promise<HouseholdMember[]> {
  return [];
}

export async function inviteMember(_data: { email: string; role: string }): Promise<Invitation> {
  throw new Error('API integration required');
}

export async function removeMember(_id: string): Promise<void> {
  return;
}

export async function updateMember(_id: string, _data: Partial<HouseholdMember>): Promise<HouseholdMember> {
  throw new Error('API integration required');
}

export async function getInvitations(): Promise<Invitation[]> {
  return [];
}

export async function cancelInvitation(_id: string): Promise<void> {
  return;
}

export async function resendInvitation(_id: string): Promise<void> {
  return;
}
