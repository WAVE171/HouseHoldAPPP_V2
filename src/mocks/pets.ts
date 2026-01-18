import type {
  Pet,
  Vaccination,
  VetAppointment,
  Medication,
  WeightRecord,
  PetExpense,
} from '@/features/pets/types/pets.types';

export const mockPets: Pet[] = [
  {
    id: '1',
    householdId: '1',
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    gender: 'male',
    dateOfBirth: '2020-03-15',
    color: 'Golden',
    weight: 75,
    weightUnit: 'lbs',
    microchipNumber: '985121098765432',
    notes: 'Friendly and loves to play fetch',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    householdId: '1',
    name: 'Luna',
    species: 'cat',
    breed: 'Maine Coon',
    gender: 'female',
    dateOfBirth: '2021-07-22',
    color: 'Tabby',
    weight: 12,
    weightUnit: 'lbs',
    microchipNumber: '985121098765433',
    notes: 'Indoor cat, loves sunny spots',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    householdId: '1',
    name: 'Tweety',
    species: 'bird',
    breed: 'Parakeet',
    gender: 'male',
    dateOfBirth: '2022-01-10',
    color: 'Blue and White',
    notes: 'Very vocal, likes music',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockVaccinations: Vaccination[] = [
  {
    id: '1',
    petId: '1',
    name: 'Rabies',
    dateGiven: '2024-01-15',
    nextDueDate: '2025-01-15',
    veterinarian: 'Dr. Smith',
    clinic: 'Happy Paws Clinic',
  },
  {
    id: '2',
    petId: '1',
    name: 'DHPP',
    dateGiven: '2024-01-15',
    nextDueDate: '2025-01-15',
    veterinarian: 'Dr. Smith',
    clinic: 'Happy Paws Clinic',
  },
  {
    id: '3',
    petId: '1',
    name: 'Bordetella',
    dateGiven: '2024-06-01',
    nextDueDate: '2025-06-01',
    veterinarian: 'Dr. Smith',
    clinic: 'Happy Paws Clinic',
  },
  {
    id: '4',
    petId: '2',
    name: 'Rabies',
    dateGiven: '2024-02-20',
    nextDueDate: '2027-02-20',
    veterinarian: 'Dr. Johnson',
    clinic: 'Feline Care Center',
  },
  {
    id: '5',
    petId: '2',
    name: 'FVRCP',
    dateGiven: '2024-02-20',
    nextDueDate: '2025-02-20',
    veterinarian: 'Dr. Johnson',
    clinic: 'Feline Care Center',
  },
];

export const mockAppointments: VetAppointment[] = [
  {
    id: '1',
    petId: '1',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    reason: 'Annual checkup',
    veterinarian: 'Dr. Smith',
    clinic: 'Happy Paws Clinic',
    status: 'scheduled',
  },
  {
    id: '2',
    petId: '2',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:30',
    reason: 'Dental cleaning',
    veterinarian: 'Dr. Johnson',
    clinic: 'Feline Care Center',
    cost: 250,
    status: 'scheduled',
  },
  {
    id: '3',
    petId: '1',
    date: '2024-01-15',
    time: '09:00',
    reason: 'Vaccination',
    veterinarian: 'Dr. Smith',
    clinic: 'Happy Paws Clinic',
    cost: 150,
    status: 'completed',
  },
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    petId: '1',
    name: 'Heartgard Plus',
    dosage: '1 chewable',
    frequency: 'Monthly',
    startDate: '2024-01-01',
    prescribedBy: 'Dr. Smith',
    notes: 'Give with food',
    isActive: true,
  },
  {
    id: '2',
    petId: '1',
    name: 'NexGard',
    dosage: '1 chewable',
    frequency: 'Monthly',
    startDate: '2024-01-01',
    prescribedBy: 'Dr. Smith',
    notes: 'Flea and tick prevention',
    isActive: true,
  },
  {
    id: '3',
    petId: '2',
    name: 'Revolution Plus',
    dosage: '1 topical',
    frequency: 'Monthly',
    startDate: '2024-02-01',
    prescribedBy: 'Dr. Johnson',
    isActive: true,
  },
];

export const mockWeightRecords: WeightRecord[] = [
  { id: '1', petId: '1', weight: 72, unit: 'lbs', date: '2024-01-15' },
  { id: '2', petId: '1', weight: 73, unit: 'lbs', date: '2024-04-15' },
  { id: '3', petId: '1', weight: 74, unit: 'lbs', date: '2024-07-15' },
  { id: '4', petId: '1', weight: 75, unit: 'lbs', date: '2024-10-15' },
  { id: '5', petId: '2', weight: 11, unit: 'lbs', date: '2024-02-20' },
  { id: '6', petId: '2', weight: 11.5, unit: 'lbs', date: '2024-05-20' },
  { id: '7', petId: '2', weight: 12, unit: 'lbs', date: '2024-08-20' },
];

export const mockExpenses: PetExpense[] = [
  { id: '1', petId: '1', category: 'vet', amount: 150, date: '2024-01-15', description: 'Annual checkup and vaccinations' },
  { id: '2', petId: '1', category: 'food', amount: 75, date: '2024-01-20', description: 'Premium dog food (40lb bag)' },
  { id: '3', petId: '1', category: 'supplies', amount: 35, date: '2024-02-01', description: 'New leash and collar' },
  { id: '4', petId: '1', category: 'grooming', amount: 65, date: '2024-02-15', description: 'Full grooming session' },
  { id: '5', petId: '2', category: 'vet', amount: 120, date: '2024-02-20', description: 'Annual checkup' },
  { id: '6', petId: '2', category: 'food', amount: 45, date: '2024-02-25', description: 'Cat food (20lb bag)' },
  { id: '7', petId: '2', category: 'supplies', amount: 80, date: '2024-03-01', description: 'Cat tree and scratching post' },
];

// Mock API functions
export async function addPet(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newPet: Pet = {
    ...pet,
    id: String(mockPets.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockPets.push(newPet);
  return newPet;
}

export async function updatePet(id: string, updates: Partial<Pet>): Promise<Pet> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockPets.findIndex(p => p.id === id);
  if (index !== -1) {
    mockPets[index] = { ...mockPets[index], ...updates, updatedAt: new Date().toISOString() };
    return mockPets[index];
  }
  throw new Error('Pet not found');
}

export async function deletePet(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockPets.findIndex(p => p.id === id);
  if (index !== -1) {
    mockPets.splice(index, 1);
  }
}

export async function addVaccination(vaccination: Omit<Vaccination, 'id'>): Promise<Vaccination> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newVaccination: Vaccination = {
    ...vaccination,
    id: String(mockVaccinations.length + 1),
  };
  mockVaccinations.push(newVaccination);
  return newVaccination;
}

export async function addAppointment(appointment: Omit<VetAppointment, 'id'>): Promise<VetAppointment> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newAppointment: VetAppointment = {
    ...appointment,
    id: String(mockAppointments.length + 1),
  };
  mockAppointments.push(newAppointment);
  return newAppointment;
}

export async function addMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newMedication: Medication = {
    ...medication,
    id: String(mockMedications.length + 1),
  };
  mockMedications.push(newMedication);
  return newMedication;
}

export async function addWeightRecord(record: Omit<WeightRecord, 'id'>): Promise<WeightRecord> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newRecord: WeightRecord = {
    ...record,
    id: String(mockWeightRecords.length + 1),
  };
  mockWeightRecords.push(newRecord);
  return newRecord;
}

export async function addExpense(expense: Omit<PetExpense, 'id'>): Promise<PetExpense> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newExpense: PetExpense = {
    ...expense,
    id: String(mockExpenses.length + 1),
  };
  mockExpenses.push(newExpense);
  return newExpense;
}
