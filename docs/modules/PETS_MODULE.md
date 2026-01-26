# Pets Module Documentation

## Overview

The Pets module manages household pets, including pet profiles, vaccination records, vet appointments, and medication tracking.

## Location

```
apps/api/src/modules/pets/
├── dto/
│   ├── create-pet.dto.ts
│   ├── update-pet.dto.ts
│   ├── create-vaccination.dto.ts
│   ├── create-appointment.dto.ts
│   └── create-medication.dto.ts
├── pets.controller.ts
├── pets.service.ts
└── pets.module.ts
```

## Endpoints

### Pets

#### POST `/api/v1/pets`

Create a new pet.

**Request Body:**
```json
{
  "name": "Max",
  "species": "DOG",
  "breed": "Golden Retriever",
  "birthDate": "2022-03-15T00:00:00.000Z",
  "gender": "Male",
  "color": "Golden",
  "microchipNumber": "123456789012345",
  "weight": 30.5,
  "vetName": "Dr. Smith",
  "vetPhone": "+1-555-123-4567",
  "vetAddress": "123 Vet Street"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Max",
    "species": "DOG",
    "breed": "Golden Retriever",
    "birthDate": "2022-03-15T00:00:00.000Z",
    "gender": "Male",
    "color": "Golden",
    "microchipNumber": "123456789012345",
    "weight": 30.5,
    "vetName": "Dr. Smith",
    "vetPhone": "+1-555-123-4567",
    "vetAddress": "123 Vet Street",
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/pets`

Get all pets for the household.

#### GET `/api/v1/pets/:id`

Get a specific pet.

#### PATCH `/api/v1/pets/:id`

Update a pet.

#### DELETE `/api/v1/pets/:id`

Delete a pet.

### Vaccinations

#### POST `/api/v1/pets/:id/vaccinations`

Add a vaccination record.

**Request Body:**
```json
{
  "name": "Rabies",
  "dateGiven": "2026-01-15T00:00:00.000Z",
  "nextDue": "2027-01-15T00:00:00.000Z",
  "vet": "Dr. Smith",
  "certificateUrl": "https://example.com/cert.pdf"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Rabies",
    "dateGiven": "2026-01-15T00:00:00.000Z",
    "nextDue": "2027-01-15T00:00:00.000Z",
    "vet": "Dr. Smith",
    "certificateUrl": "https://example.com/cert.pdf",
    "petId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/pets/:id/vaccinations`

Get vaccination records for a pet.

### Appointments

#### POST `/api/v1/pets/:id/appointments`

Add a vet appointment.

**Request Body:**
```json
{
  "date": "2026-02-01T10:00:00.000Z",
  "reason": "Annual checkup",
  "vet": "Dr. Smith",
  "notes": "Bring vaccination records",
  "cost": 150.00
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "date": "2026-02-01T10:00:00.000Z",
    "reason": "Annual checkup",
    "vet": "Dr. Smith",
    "notes": "Bring vaccination records",
    "cost": 150.00,
    "petId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/pets/:id/appointments`

Get appointments for a pet.

### Medications

#### POST `/api/v1/pets/:id/medications`

Add a medication record.

**Request Body:**
```json
{
  "name": "Heartworm Prevention",
  "dosage": "1 tablet",
  "frequency": "Monthly",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-12-31T00:00:00.000Z",
  "prescribedBy": "Dr. Smith",
  "notes": "Give with food"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Heartworm Prevention",
    "dosage": "1 tablet",
    "frequency": "Monthly",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-12-31T00:00:00.000Z",
    "prescribedBy": "Dr. Smith",
    "notes": "Give with food",
    "petId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/pets/:id/medications`

Get medications for a pet.

## Enums

### PetSpecies

```typescript
enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER'
}
```

## Data Models

### Pet

```typescript
interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  gender?: string;
  color?: string;
  microchipNumber?: string;
  weight?: number;
  vetName?: string;
  vetPhone?: string;
  vetAddress?: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Vaccination

```typescript
interface Vaccination {
  id: string;
  name: string;
  dateGiven: string;
  nextDue: string;
  vet?: string;
  certificateUrl?: string;
  petId: string;
  createdAt: string;
}
```

### Appointment

```typescript
interface Appointment {
  id: string;
  date: string;
  reason: string;
  vet?: string;
  notes?: string;
  cost?: number;
  petId: string;
  createdAt: string;
}
```

### Medication

```typescript
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
  petId: string;
  createdAt: string;
}
```

## Service Methods

```typescript
class PetsService {
  // Pets
  async createPet(householdId: string, dto: CreatePetDto): Promise<Pet>
  async getPets(householdId: string): Promise<Pet[]>
  async getPet(householdId: string, petId: string): Promise<Pet>
  async updatePet(householdId: string, petId: string, dto: UpdatePetDto): Promise<Pet>
  async deletePet(householdId: string, petId: string): Promise<void>

  // Vaccinations
  async addVaccination(householdId: string, petId: string, dto: CreateVaccinationDto): Promise<Vaccination>
  async getVaccinations(householdId: string, petId: string): Promise<Vaccination[]>

  // Appointments
  async addAppointment(householdId: string, petId: string, dto: CreateAppointmentDto): Promise<Appointment>
  async getAppointments(householdId: string, petId: string): Promise<Appointment[]>

  // Medications
  async addMedication(householdId: string, petId: string, dto: CreateMedicationDto): Promise<Medication>
  async getMedications(householdId: string, petId: string): Promise<Medication[]>
}
```

## Frontend Integration

```typescript
// src/shared/api/pets.api.ts
export const petsApi = {
  // Pets
  createPet: async (data: CreatePetData) => {
    const response = await apiClient.post('/pets', data);
    return response.data;
  },

  getPets: async () => {
    const response = await apiClient.get('/pets');
    return response.data;
  },

  getPet: async (id: string) => {
    const response = await apiClient.get(`/pets/${id}`);
    return response.data;
  },

  updatePet: async (id: string, data: Partial<CreatePetData>) => {
    const response = await apiClient.patch(`/pets/${id}`, data);
    return response.data;
  },

  deletePet: async (id: string) => {
    await apiClient.delete(`/pets/${id}`);
  },

  // Vaccinations
  addVaccination: async (petId: string, data: CreateVaccinationData) => {
    const response = await apiClient.post(`/pets/${petId}/vaccinations`, data);
    return response.data;
  },

  getVaccinations: async (petId: string) => {
    const response = await apiClient.get(`/pets/${petId}/vaccinations`);
    return response.data;
  },

  // Appointments
  addAppointment: async (petId: string, data: CreateAppointmentData) => {
    const response = await apiClient.post(`/pets/${petId}/appointments`, data);
    return response.data;
  },

  getAppointments: async (petId: string) => {
    const response = await apiClient.get(`/pets/${petId}/appointments`);
    return response.data;
  },

  // Medications
  addMedication: async (petId: string, data: CreateMedicationData) => {
    const response = await apiClient.post(`/pets/${petId}/medications`, data);
    return response.data;
  },

  getMedications: async (petId: string) => {
    const response = await apiClient.get(`/pets/${petId}/medications`);
    return response.data;
  }
};
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Pet not found |
