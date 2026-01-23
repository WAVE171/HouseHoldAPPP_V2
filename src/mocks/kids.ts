// Stub file - API integration pending

export interface Kid {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  school?: string;
  grade?: string;
  avatar?: string;
}

export interface KidActivity {
  id: string;
  kidId: string;
  type: string;
  description: string;
  date: string;
}

export const mockKids: Kid[] = [];
export const mockActivities: KidActivity[] = [];

export async function getKids(): Promise<Kid[]> {
  return [];
}

export async function createKid(_data: Partial<Kid>): Promise<Kid> {
  throw new Error('API integration required');
}

export async function updateKid(_id: string, _data: Partial<Kid>): Promise<Kid> {
  throw new Error('API integration required');
}

export async function deleteKid(_id: string): Promise<void> {
  return;
}

export async function getKidActivities(_kidId: string): Promise<KidActivity[]> {
  return [];
}
