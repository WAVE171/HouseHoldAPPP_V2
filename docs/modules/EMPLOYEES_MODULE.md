# Employees Module Documentation

## Overview

The Employees module manages household staff/employees, including employee profiles, salary payments, and vacation tracking.

## Location

```
apps/api/src/modules/employees/
├── dto/
│   ├── create-employee.dto.ts
│   ├── update-employee.dto.ts
│   ├── create-payment.dto.ts
│   └── create-vacation.dto.ts
├── employees.controller.ts
├── employees.service.ts
└── employees.module.ts
```

## Endpoints

### Employees

#### POST `/api/v1/employees`

Create a new employee.

**Request Body:**
```json
{
  "firstName": "Maria",
  "lastName": "Santos",
  "email": "maria@example.com",
  "phone": "+1-555-123-4567",
  "address": "123 Main Street",
  "position": "Housekeeper",
  "department": "Housekeeping",
  "employmentType": "FULL_TIME",
  "salary": 3500.00,
  "payFrequency": "MONTHLY",
  "hireDate": "2025-01-01T00:00:00.000Z",
  "emergencyContactName": "John Santos",
  "emergencyContactPhone": "+1-555-987-6543"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "firstName": "Maria",
    "lastName": "Santos",
    "email": "maria@example.com",
    "phone": "+1-555-123-4567",
    "address": "123 Main Street",
    "position": "Housekeeper",
    "department": "Housekeeping",
    "employmentType": "FULL_TIME",
    "salary": 3500.00,
    "payFrequency": "MONTHLY",
    "hireDate": "2025-01-01T00:00:00.000Z",
    "emergencyContactName": "John Santos",
    "emergencyContactPhone": "+1-555-987-6543",
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/employees`

Get all employees for the household.

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "firstName": "Maria",
      "lastName": "Santos",
      "position": "Housekeeper",
      "employmentType": "FULL_TIME",
      "salary": 3500.00,
      "hireDate": "2025-01-01T00:00:00.000Z",
      "householdId": "clx...",
      "createdAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/v1/employees/:id`

Get a specific employee.

#### PATCH `/api/v1/employees/:id`

Update an employee.

**Request Body:**
```json
{
  "salary": 4000.00,
  "position": "Senior Housekeeper"
}
```

#### DELETE `/api/v1/employees/:id`

Delete an employee.

### Payments (Frontend API Ready)

#### POST `/api/v1/employees/:id/payments`

Add a salary payment.

**Request Body:**
```json
{
  "amount": 3500.00,
  "paymentDate": "2026-01-31T00:00:00.000Z",
  "period": "January 2026",
  "paymentMethod": "Bank Transfer",
  "notes": "Monthly salary"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "amount": 3500.00,
    "paymentDate": "2026-01-31T00:00:00.000Z",
    "period": "January 2026",
    "paymentMethod": "Bank Transfer",
    "notes": "Monthly salary",
    "employeeId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/employees/:id/payments`

Get payment history for an employee.

### Vacations (Frontend API Ready)

#### POST `/api/v1/employees/:id/vacations`

Add a vacation request.

**Request Body:**
```json
{
  "startDate": "2026-02-15T00:00:00.000Z",
  "endDate": "2026-02-22T00:00:00.000Z",
  "days": 5,
  "approved": true,
  "notes": "Annual leave"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "startDate": "2026-02-15T00:00:00.000Z",
    "endDate": "2026-02-22T00:00:00.000Z",
    "days": 5,
    "approved": true,
    "notes": "Annual leave",
    "employeeId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

#### GET `/api/v1/employees/:id/vacations`

Get vacation records for an employee.

## Enums

### EmploymentType

```typescript
enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT'
}
```

### PayFrequency

```typescript
enum PayFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY'
}
```

## Data Models

### Employee

```typescript
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  position: string;
  department?: string;
  employmentType: string;
  salary: number;
  payFrequency: string;
  hireDate: string;
  terminationDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  photo?: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}
```

### SalaryPayment

```typescript
interface SalaryPayment {
  id: string;
  amount: number;
  paymentDate: string;
  period: string;
  paymentMethod?: string;
  notes?: string;
  employeeId: string;
  createdAt: string;
}
```

### EmployeeVacation

```typescript
interface EmployeeVacation {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  approved: boolean;
  notes?: string;
  employeeId: string;
  createdAt: string;
}
```

## Service Methods

```typescript
class EmployeesService {
  // Employees
  async createEmployee(householdId: string, dto: CreateEmployeeDto): Promise<Employee>
  async getEmployees(householdId: string): Promise<Employee[]>
  async getEmployee(householdId: string, employeeId: string): Promise<Employee>
  async updateEmployee(householdId: string, employeeId: string, dto: UpdateEmployeeDto): Promise<Employee>
  async deleteEmployee(householdId: string, employeeId: string): Promise<void>
}
```

## Frontend Integration

```typescript
// src/shared/api/employees.api.ts
export const employeesApi = {
  // Employees
  createEmployee: async (data: CreateEmployeeData) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  getEmployees: async () => {
    const response = await apiClient.get('/employees');
    return response.data;
  },

  getEmployee: async (id: string) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  updateEmployee: async (id: string, data: Partial<CreateEmployeeData>) => {
    const response = await apiClient.patch(`/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    await apiClient.delete(`/employees/${id}`);
  },

  // Payments
  addPayment: async (employeeId: string, data: CreatePaymentData) => {
    const response = await apiClient.post(`/employees/${employeeId}/payments`, data);
    return response.data;
  },

  getPayments: async (employeeId: string) => {
    const response = await apiClient.get(`/employees/${employeeId}/payments`);
    return response.data;
  },

  // Vacations
  addVacation: async (employeeId: string, data: CreateVacationData) => {
    const response = await apiClient.post(`/employees/${employeeId}/vacations`, data);
    return response.data;
  },

  getVacations: async (employeeId: string) => {
    const response = await apiClient.get(`/employees/${employeeId}/vacations`);
    return response.data;
  }
};
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Employee not found |
