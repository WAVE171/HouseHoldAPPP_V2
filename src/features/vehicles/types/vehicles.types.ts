export type VehicleType = 'CAR' | 'TRUCK' | 'SUV' | 'VAN' | 'MOTORCYCLE' | 'OTHER';

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  mileage?: number;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  insuranceProvider?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  primaryDriver?: string;
  imageUrl?: string;
  notes?: string;
  householdId: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'inspection' | 'repair' | 'other';
  description: string;
  date: string;
  mileage: number;
  cost: number;
  provider?: string;
  notes?: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  mileage: number;
  station?: string;
  isFillUp: boolean;
}
