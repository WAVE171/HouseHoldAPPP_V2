// Stub file - API integration pending

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position: string;
  department?: string;
  salary: number;
  payFrequency: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  period: string;
}

export const mockEmployees: Employee[] = [];
export const mockPayments: SalaryPayment[] = [];

export async function getEmployees(): Promise<Employee[]> {
  return [];
}

export async function createEmployee(_data: Partial<Employee>): Promise<Employee> {
  throw new Error('API integration required');
}

export async function updateEmployee(_id: string, _data: Partial<Employee>): Promise<Employee> {
  throw new Error('API integration required');
}

export async function deleteEmployee(_id: string): Promise<void> {
  return;
}

export async function getPayments(_employeeId: string): Promise<SalaryPayment[]> {
  return [];
}

export async function recordPayment(_data: Partial<SalaryPayment>): Promise<SalaryPayment> {
  throw new Error('API integration required');
}
