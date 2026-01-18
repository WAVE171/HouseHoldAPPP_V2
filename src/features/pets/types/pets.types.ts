export interface Pet {
  id: string;
  householdId: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'reptile' | 'other';
  breed?: string;
  gender: 'male' | 'female' | 'unknown';
  dateOfBirth?: string;
  color?: string;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  microchipNumber?: string;
  photo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  dateGiven: string;
  nextDueDate?: string;
  veterinarian?: string;
  clinic?: string;
  notes?: string;
}

export interface VetAppointment {
  id: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  veterinarian?: string;
  clinic?: string;
  cost?: number;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
  isActive: boolean;
}

export interface WeightRecord {
  id: string;
  petId: string;
  weight: number;
  unit: 'lbs' | 'kg';
  date: string;
  notes?: string;
}

export interface PetExpense {
  id: string;
  petId: string;
  category: 'vet' | 'food' | 'supplies' | 'grooming' | 'medications' | 'other';
  amount: number;
  date: string;
  description: string;
  notes?: string;
}
