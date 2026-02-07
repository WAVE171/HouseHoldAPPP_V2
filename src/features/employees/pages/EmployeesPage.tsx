import { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { EmployeeCard } from '../components/EmployeeCard';
import { PayrollSummary } from '../components/PayrollSummary';
import { ScheduleOverview } from '../components/ScheduleOverview';
import { AddEmployeeDialog } from '../components/AddEmployeeDialog';
import { EditEmployeeDialog } from '../components/EditEmployeeDialog';
import type { Employee, PayrollRecord, TimeEntry } from '../types/employees.types';
import { employeesApi, type CreateEmployeeData } from '@/shared/api/employees.api';
import { useToast } from '@/shared/hooks/use-toast';
import { mockPayrollRecords, mockTimeEntries, processPayroll } from '@/mocks/employees';

export function EmployeesPage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [_timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const data = await employeesApi.getEmployees();
        const mappedEmployees: Employee[] = data.map(e => ({
          id: e.id,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          phone: e.phone,
          address: e.address,
          position: e.position,
          department: e.department,
          employmentType: e.employmentType as Employee['employmentType'],
          salary: e.salary,
          payFrequency: e.payFrequency as Employee['payFrequency'],
          hireDate: e.hireDate,
          terminationDate: e.terminationDate,
          emergencyContactName: e.emergencyContactName,
          emergencyContactPhone: e.emergencyContactPhone,
          photo: e.photo,
          status: e.terminationDate ? 'inactive' : 'active',
        }));
        setEmployees(mappedEmployees);
        setPayrollRecords(mockPayrollRecords);
        setTimeEntries(mockTimeEntries);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        setPayrollRecords(mockPayrollRecords);
        setTimeEntries(mockTimeEntries);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      !searchQuery ||
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const activeEmployees = filteredEmployees.filter(e => e.status === 'active');
  const inactiveEmployees = filteredEmployees.filter(e => e.status !== 'active');

  const handleProcessPayroll = async (payrollId: string) => {
    const updated = await processPayroll(payrollId);
    setPayrollRecords(prev =>
      prev.map(r => (r.id === payrollId ? updated : r))
    );
  };

  const handleAddEmployee = async (data: CreateEmployeeData) => {
    try {
      const created = await employeesApi.createEmployee(data);
      const newEmployee: Employee = {
        id: created.id,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        phone: created.phone,
        address: created.address,
        position: created.position,
        department: created.department as Employee['department'],
        employmentType: created.employmentType as Employee['employmentType'],
        salary: created.salary,
        payFrequency: created.payFrequency as Employee['payFrequency'],
        hireDate: created.hireDate,
        terminationDate: created.terminationDate,
        emergencyContactName: created.emergencyContactName,
        emergencyContactPhone: created.emergencyContactPhone,
        photo: created.photo,
        status: 'active',
      };
      setEmployees(prev => [...prev, newEmployee]);
      toast({
        title: 'Success',
        description: `${created.firstName} ${created.lastName} has been added`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add employee',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateEmployee = async (id: string, data: Partial<CreateEmployeeData>) => {
    try {
      const updated = await employeesApi.updateEmployee(id, data);
      const updatedEmployee: Employee = {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        position: updated.position,
        department: updated.department as Employee['department'],
        employmentType: updated.employmentType as Employee['employmentType'],
        salary: updated.salary,
        payFrequency: updated.payFrequency as Employee['payFrequency'],
        hireDate: updated.hireDate,
        terminationDate: updated.terminationDate,
        emergencyContactName: updated.emergencyContactName,
        emergencyContactPhone: updated.emergencyContactPhone,
        photo: updated.photo,
        status: updated.terminationDate ? 'inactive' : 'active',
      };
      setEmployees(prev => prev.map(e => e.id === id ? updatedEmployee : e));
      toast({
        title: 'Success',
        description: `${updated.firstName} ${updated.lastName} has been updated`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update employee',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage household staff, schedules, and payroll.
          </p>
        </div>
        <AddEmployeeDialog onAddEmployee={handleAddEmployee} />
      </div>

      {/* Schedule Overview */}
      <ScheduleOverview employees={employees} />

      {/* Tabs */}
      <Tabs defaultValue="directory" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="directory">
              Directory
              <Badge variant="secondary" className="ml-2">
                {activeEmployees.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="payroll">
              Payroll
              <Badge variant="secondary" className="ml-2">
                {payrollRecords.filter(r => r.status === 'pending').length} pending
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="directory">
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <Users className="h-12 w-12 mb-4" />
              <p className="text-lg">No employees found</p>
              <p className="text-sm">Add your first employee to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeEmployees.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Active Employees</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeEmployees.map(employee => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onSelect={handleSelectEmployee}
                      />
                    ))}
                  </div>
                </div>
              )}

              {inactiveEmployees.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Inactive / On Leave
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {inactiveEmployees.map(employee => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onSelect={handleSelectEmployee}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payroll">
          <PayrollSummary
            employees={employees}
            payrollRecords={payrollRecords}
            onProcessPayroll={handleProcessPayroll}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <EditEmployeeDialog
        employee={selectedEmployee}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateEmployee={handleUpdateEmployee}
      />
    </div>
  );
}
