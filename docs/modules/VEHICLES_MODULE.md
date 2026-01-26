# Vehicles Module Documentation

## Overview

The Vehicles module manages household vehicles, including vehicle details, maintenance records, and fuel logs for tracking expenses and service history.

## Location

```
apps/api/src/modules/vehicles/
├── dto/
│   ├── create-vehicle.dto.ts
│   ├── update-vehicle.dto.ts
│   ├── create-maintenance.dto.ts
│   └── create-fuel-log.dto.ts
├── vehicles.controller.ts
├── vehicles.service.ts
└── vehicles.module.ts
```

## Endpoints

### Vehicles

#### POST `/api/v1/vehicles`

Create a new vehicle.

**Request Body:**
```json
{
  "type": "CAR",
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "color": "Silver",
  "licensePlate": "ABC-1234",
  "vin": "1HGBH41JXMN109186",
  "mileage": 15000
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "type": "CAR",
    "make": "Toyota",
    "model": "Camry",
    "year": 2022,
    "color": "Silver",
    "licensePlate": "ABC-1234",
    "vin": "1HGBH41JXMN109186",
    "mileage": 15000,
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/vehicles`

Get all vehicles for the household.

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "type": "CAR",
      "make": "Toyota",
      "model": "Camry",
      "year": 2022,
      "mileage": 15000,
      "householdId": "clx...",
      "createdAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/v1/vehicles/:id`

Get a specific vehicle.

#### PATCH `/api/v1/vehicles/:id`

Update a vehicle.

**Request Body:**
```json
{
  "mileage": 16500
}
```

#### DELETE `/api/v1/vehicles/:id`

Delete a vehicle.

### Maintenance

#### POST `/api/v1/vehicles/:id/maintenance`

Add a maintenance record.

**Request Body:**
```json
{
  "type": "Oil Change",
  "description": "Full synthetic oil change",
  "date": "2026-01-15T00:00:00.000Z",
  "mileage": 15000,
  "cost": 75.00,
  "serviceProvider": "Quick Lube",
  "nextDueDate": "2026-04-15T00:00:00.000Z"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "type": "Oil Change",
    "description": "Full synthetic oil change",
    "date": "2026-01-15T00:00:00.000Z",
    "mileage": 15000,
    "cost": 75.00,
    "serviceProvider": "Quick Lube",
    "nextDueDate": "2026-04-15T00:00:00.000Z",
    "vehicleId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/vehicles/:id/maintenance`

Get maintenance history for a vehicle.

### Fuel Logs

#### POST `/api/v1/vehicles/:id/fuel`

Add a fuel log.

**Request Body:**
```json
{
  "date": "2026-01-20T00:00:00.000Z",
  "gallons": 12.5,
  "pricePerGallon": 3.45,
  "totalCost": 43.13,
  "mileage": 15500,
  "station": "Shell"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "date": "2026-01-20T00:00:00.000Z",
    "gallons": 12.5,
    "pricePerGallon": 3.45,
    "totalCost": 43.13,
    "mileage": 15500,
    "station": "Shell",
    "vehicleId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/vehicles/:id/fuel`

Get fuel logs for a vehicle.

## Enums

### VehicleType

```typescript
enum VehicleType {
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  SUV = 'SUV',
  VAN = 'VAN',
  MOTORCYCLE = 'MOTORCYCLE',
  OTHER = 'OTHER'
}
```

## Data Models

### Vehicle

```typescript
interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  mileage?: number;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}
```

### MaintenanceRecord

```typescript
interface MaintenanceRecord {
  id: string;
  type: string;
  description?: string;
  date: string;
  mileage?: number;
  cost?: number;
  serviceProvider?: string;
  nextDueDate?: string;
  vehicleId: string;
  createdAt: string;
}
```

### FuelLog

```typescript
interface FuelLog {
  id: string;
  date: string;
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  mileage?: number;
  station?: string;
  vehicleId: string;
  createdAt: string;
}
```

## Service Methods

```typescript
class VehiclesService {
  // Vehicles
  async createVehicle(householdId: string, dto: CreateVehicleDto): Promise<Vehicle>
  async getVehicles(householdId: string): Promise<Vehicle[]>
  async getVehicle(householdId: string, vehicleId: string): Promise<Vehicle>
  async updateVehicle(householdId: string, vehicleId: string, dto: UpdateVehicleDto): Promise<Vehicle>
  async deleteVehicle(householdId: string, vehicleId: string): Promise<void>

  // Maintenance
  async addMaintenance(householdId: string, vehicleId: string, dto: CreateMaintenanceDto): Promise<MaintenanceRecord>
  async getMaintenanceHistory(householdId: string, vehicleId: string): Promise<MaintenanceRecord[]>

  // Fuel Logs
  async addFuelLog(householdId: string, vehicleId: string, dto: CreateFuelLogDto): Promise<FuelLog>
  async getFuelLogs(householdId: string, vehicleId: string): Promise<FuelLog[]>
}
```

## Frontend Integration

```typescript
// src/shared/api/vehicles.api.ts
export const vehiclesApi = {
  // Vehicles
  createVehicle: async (data: CreateVehicleData) => {
    const response = await apiClient.post('/vehicles', data);
    return response.data;
  },

  getVehicles: async () => {
    const response = await apiClient.get('/vehicles');
    return response.data;
  },

  getVehicle: async (id: string) => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<CreateVehicleData>) => {
    const response = await apiClient.patch(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string) => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  // Maintenance
  addMaintenance: async (vehicleId: string, data: CreateMaintenanceData) => {
    const response = await apiClient.post(`/vehicles/${vehicleId}/maintenance`, data);
    return response.data;
  },

  getMaintenanceHistory: async (vehicleId: string) => {
    const response = await apiClient.get(`/vehicles/${vehicleId}/maintenance`);
    return response.data;
  },

  // Fuel Logs
  addFuelLog: async (vehicleId: string, data: CreateFuelLogData) => {
    const response = await apiClient.post(`/vehicles/${vehicleId}/fuel`, data);
    return response.data;
  },

  getFuelLogs: async (vehicleId: string) => {
    const response = await apiClient.get(`/vehicles/${vehicleId}/fuel`);
    return response.data;
  }
};
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Vehicle not found |
