// Stub file - API integration pending

export interface Vehicle {
  id: string;
  type: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  mileage?: number;
  ownerId?: string;
}

export interface VehicleMaintenance {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  cost?: number;
  notes?: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  gallons: number;
  totalCost: number;
  mileage?: number;
}

export const mockVehicles: Vehicle[] = [];
export const mockMaintenance: VehicleMaintenance[] = [];
export const mockFuelLogs: FuelLog[] = [];

export async function getVehicles(): Promise<Vehicle[]> {
  return [];
}

export async function createVehicle(_data: Partial<Vehicle>): Promise<Vehicle> {
  throw new Error('API integration required');
}

export async function updateVehicle(_id: string, _data: Partial<Vehicle>): Promise<Vehicle> {
  throw new Error('API integration required');
}

export async function deleteVehicle(_id: string): Promise<void> {
  return;
}

export async function getMaintenanceHistory(_vehicleId: string): Promise<VehicleMaintenance[]> {
  return [];
}

export async function getFuelLogs(_vehicleId: string): Promise<FuelLog[]> {
  return [];
}

export async function addMaintenance(_data: Partial<VehicleMaintenance>): Promise<VehicleMaintenance> {
  throw new Error('API integration required');
}

export async function addFuelLog(_data: Partial<FuelLog>): Promise<FuelLog> {
  throw new Error('API integration required');
}
