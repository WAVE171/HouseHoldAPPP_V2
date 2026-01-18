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
