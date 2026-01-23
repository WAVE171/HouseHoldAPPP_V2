// Stub file - API integration pending

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  vetName?: string;
  vetPhone?: string;
}

export interface PetVaccination {
  id: string;
  petId: string;
  name: string;
  dateGiven: string;
  nextDue: string;
}

export const mockPets: Pet[] = [];
export const mockVaccinations: PetVaccination[] = [];

export async function getPets(): Promise<Pet[]> {
  return [];
}

export async function createPet(_data: Partial<Pet>): Promise<Pet> {
  throw new Error('API integration required');
}

export async function updatePet(_id: string, _data: Partial<Pet>): Promise<Pet> {
  throw new Error('API integration required');
}

export async function deletePet(_id: string): Promise<void> {
  return;
}

export async function getPetVaccinations(_petId: string): Promise<PetVaccination[]> {
  return [];
}
