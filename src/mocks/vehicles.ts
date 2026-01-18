export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
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

const today = new Date();
const getDate = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    color: 'Silver',
    licensePlate: 'ABC-1234',
    vin: '1HGCV1F34NA123456',
    mileage: 24500,
    fuelType: 'gasoline',
    insuranceProvider: 'State Farm',
    insuranceExpiry: getDate(120),
    registrationExpiry: getDate(180),
    primaryDriver: 'John Smith',
    householdId: '1',
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'RAV4',
    year: 2021,
    color: 'Blue',
    licensePlate: 'XYZ-5678',
    vin: '2T3P1RFV8MW123456',
    mileage: 32100,
    fuelType: 'hybrid',
    insuranceProvider: 'Geico',
    insuranceExpiry: getDate(90),
    registrationExpiry: getDate(45),
    primaryDriver: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    color: 'White',
    licensePlate: 'EV-9012',
    vin: '5YJ3E1EA1PF123456',
    mileage: 8500,
    fuelType: 'electric',
    insuranceProvider: 'Progressive',
    insuranceExpiry: getDate(200),
    registrationExpiry: getDate(300),
    primaryDriver: 'John Smith',
    householdId: '1',
  },
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'oil_change',
    description: 'Full synthetic oil change',
    date: getDate(-15),
    mileage: 24200,
    cost: 75.99,
    provider: 'Jiffy Lube',
  },
  {
    id: '2',
    vehicleId: '1',
    type: 'tire_rotation',
    description: 'Tire rotation and balance',
    date: getDate(-30),
    mileage: 23800,
    cost: 49.99,
    provider: 'Discount Tire',
  },
  {
    id: '3',
    vehicleId: '2',
    type: 'brake_service',
    description: 'Front brake pad replacement',
    date: getDate(-45),
    mileage: 31500,
    cost: 299.99,
    provider: 'Toyota Dealer',
  },
  {
    id: '4',
    vehicleId: '2',
    type: 'inspection',
    description: 'Annual state inspection',
    date: getDate(-60),
    mileage: 30800,
    cost: 25.00,
    provider: 'AutoCare Center',
  },
  {
    id: '5',
    vehicleId: '3',
    type: 'tire_rotation',
    description: 'Tire rotation',
    date: getDate(-20),
    mileage: 8200,
    cost: 0,
    provider: 'Tesla Service Center',
    notes: 'Free with warranty',
  },
];

export const mockFuelRecords: FuelRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    date: getDate(-3),
    gallons: 12.5,
    pricePerGallon: 3.45,
    totalCost: 43.13,
    mileage: 24500,
    station: 'Shell',
    isFillUp: true,
  },
  {
    id: '2',
    vehicleId: '1',
    date: getDate(-10),
    gallons: 11.8,
    pricePerGallon: 3.52,
    totalCost: 41.54,
    mileage: 24150,
    station: 'Costco',
    isFillUp: true,
  },
  {
    id: '3',
    vehicleId: '2',
    date: getDate(-5),
    gallons: 8.2,
    pricePerGallon: 3.48,
    totalCost: 28.54,
    mileage: 32100,
    station: 'BP',
    isFillUp: true,
  },
  {
    id: '4',
    vehicleId: '1',
    date: getDate(-17),
    gallons: 13.1,
    pricePerGallon: 3.39,
    totalCost: 44.41,
    mileage: 23800,
    station: 'Exxon',
    isFillUp: true,
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getVehicles(): Promise<Vehicle[]> {
  await delay(300);
  return mockVehicles;
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  await delay(300);
  return mockVehicles.find(v => v.id === id);
}

export async function getMaintenanceRecords(vehicleId?: string): Promise<MaintenanceRecord[]> {
  await delay(300);
  if (vehicleId) {
    return mockMaintenanceRecords.filter(r => r.vehicleId === vehicleId);
  }
  return mockMaintenanceRecords;
}

export async function getFuelRecords(vehicleId?: string): Promise<FuelRecord[]> {
  await delay(300);
  if (vehicleId) {
    return mockFuelRecords.filter(r => r.vehicleId === vehicleId);
  }
  return mockFuelRecords;
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  await delay(500);
  const newVehicle: Vehicle = {
    ...vehicle,
    id: String(mockVehicles.length + 1),
  };
  mockVehicles.push(newVehicle);
  return newVehicle;
}

export async function addMaintenanceRecord(record: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> {
  await delay(500);
  const newRecord: MaintenanceRecord = {
    ...record,
    id: String(mockMaintenanceRecords.length + 1),
  };
  mockMaintenanceRecords.push(newRecord);
  return newRecord;
}

export async function addFuelRecord(record: Omit<FuelRecord, 'id'>): Promise<FuelRecord> {
  await delay(500);
  const newRecord: FuelRecord = {
    ...record,
    id: String(mockFuelRecords.length + 1),
  };
  mockFuelRecords.push(newRecord);
  return newRecord;
}

export async function updateVehicleMileage(vehicleId: string, mileage: number): Promise<Vehicle> {
  await delay(300);
  const vehicle = mockVehicles.find(v => v.id === vehicleId);
  if (!vehicle) throw new Error('Vehicle not found');
  vehicle.mileage = mileage;
  return vehicle;
}
