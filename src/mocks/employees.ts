export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: 'household' | 'childcare' | 'maintenance' | 'security' | 'other';
  employmentType: 'full-time' | 'part-time' | 'contractor';
  startDate: string;
  endDate?: string;
  hourlyRate?: number;
  salary?: number;
  schedule?: WorkSchedule[];
  avatar?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  status: 'active' | 'inactive' | 'on-leave';
  householdId: string;
}

export interface WorkSchedule {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  hoursWorked: number;
  regularPay: number;
  overtime: number;
  overtimePay: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'paid';
  paidDate?: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  hoursWorked?: number;
  notes?: string;
}

const today = new Date();
const getDate = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '555-100-0005',
    position: 'Housekeeper',
    department: 'household',
    employmentType: 'part-time',
    startDate: '2024-02-01',
    hourlyRate: 25,
    schedule: [
      { dayOfWeek: 'monday', startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 'wednesday', startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 'friday', startTime: '09:00', endTime: '13:00' },
    ],
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '555-200-0001',
      relationship: 'Spouse',
    },
    status: 'active',
    householdId: '1',
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '555-100-0006',
    position: 'Gardener',
    department: 'maintenance',
    employmentType: 'contractor',
    startDate: '2024-03-15',
    hourlyRate: 35,
    schedule: [
      { dayOfWeek: 'saturday', startTime: '08:00', endTime: '12:00' },
    ],
    status: 'active',
    householdId: '1',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@email.com',
    phone: '555-100-0007',
    position: 'Nanny',
    department: 'childcare',
    employmentType: 'full-time',
    startDate: '2023-09-01',
    salary: 52000,
    schedule: [
      { dayOfWeek: 'monday', startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 'tuesday', startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 'wednesday', startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 'thursday', startTime: '14:00', endTime: '18:00' },
      { dayOfWeek: 'friday', startTime: '14:00', endTime: '18:00' },
    ],
    emergencyContact: {
      name: 'David Chen',
      phone: '555-200-0002',
      relationship: 'Brother',
    },
    status: 'active',
    householdId: '1',
  },
];

export const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    periodStart: getDate(-14),
    periodEnd: getDate(-1),
    hoursWorked: 24,
    regularPay: 600,
    overtime: 0,
    overtimePay: 0,
    deductions: 60,
    netPay: 540,
    status: 'paid',
    paidDate: getDate(0),
  },
  {
    id: '2',
    employeeId: '2',
    periodStart: getDate(-14),
    periodEnd: getDate(-1),
    hoursWorked: 8,
    regularPay: 280,
    overtime: 0,
    overtimePay: 0,
    deductions: 0,
    netPay: 280,
    status: 'paid',
    paidDate: getDate(0),
  },
  {
    id: '3',
    employeeId: '3',
    periodStart: getDate(-14),
    periodEnd: getDate(-1),
    hoursWorked: 40,
    regularPay: 1000,
    overtime: 0,
    overtimePay: 0,
    deductions: 150,
    netPay: 850,
    status: 'paid',
    paidDate: getDate(0),
  },
  {
    id: '4',
    employeeId: '1',
    periodStart: getDate(0),
    periodEnd: getDate(13),
    hoursWorked: 12,
    regularPay: 300,
    overtime: 0,
    overtimePay: 0,
    deductions: 30,
    netPay: 270,
    status: 'pending',
  },
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeId: '1',
    date: getDate(-1),
    clockIn: '09:05',
    clockOut: '13:10',
    hoursWorked: 4.08,
  },
  {
    id: '2',
    employeeId: '1',
    date: getDate(-3),
    clockIn: '08:55',
    clockOut: '13:00',
    hoursWorked: 4.08,
  },
  {
    id: '3',
    employeeId: '3',
    date: getDate(-1),
    clockIn: '14:00',
    clockOut: '18:15',
    hoursWorked: 4.25,
  },
  {
    id: '4',
    employeeId: '2',
    date: getDate(-2),
    clockIn: '08:00',
    clockOut: '12:30',
    hoursWorked: 4.5,
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getEmployees(): Promise<Employee[]> {
  await delay(300);
  return mockEmployees;
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
  await delay(300);
  return mockEmployees.find(e => e.id === id);
}

export async function getPayrollRecords(employeeId?: string): Promise<PayrollRecord[]> {
  await delay(300);
  if (employeeId) {
    return mockPayrollRecords.filter(r => r.employeeId === employeeId);
  }
  return mockPayrollRecords;
}

export async function getTimeEntries(employeeId?: string): Promise<TimeEntry[]> {
  await delay(300);
  if (employeeId) {
    return mockTimeEntries.filter(e => e.employeeId === employeeId);
  }
  return mockTimeEntries;
}

export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
  await delay(500);
  const newEmployee: Employee = {
    ...employee,
    id: String(mockEmployees.length + 1),
  };
  mockEmployees.push(newEmployee);
  return newEmployee;
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
  await delay(300);
  const index = mockEmployees.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Employee not found');
  mockEmployees[index] = { ...mockEmployees[index], ...updates };
  return mockEmployees[index];
}

export async function processPayroll(payrollId: string): Promise<PayrollRecord> {
  await delay(500);
  const record = mockPayrollRecords.find(r => r.id === payrollId);
  if (!record) throw new Error('Payroll record not found');
  record.status = 'paid';
  record.paidDate = new Date().toISOString();
  return record;
}
