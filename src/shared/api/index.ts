// API Client
export { apiClient, getApiErrorMessage } from './client';

// API Services
export { authApi } from './auth.api';
export { householdApi } from './household.api';
export { financeApi } from './finance.api';
export { tasksApi } from './tasks.api';
export { inventoryApi } from './inventory.api';
export { calendarApi } from './calendar.api';
export { vehiclesApi } from './vehicles.api';
export { petsApi } from './pets.api';
export { employeesApi } from './employees.api';
export { recipesApi } from './recipes.api';
export { kidsApi } from './kids.api';
export { scanningApi } from './scanning.api';
export { dashboardApi } from './dashboard.api';
export { adminApi } from './admin.api';
export { notificationsApi } from './notifications.api';

// Types
export type {
  Transaction,
  CreateTransactionData,
  Budget,
  CreateBudgetData,
  BudgetCategory,
  FinanceSummary,
} from './finance.api';

export type {
  Task,
  CreateTaskData,
  TaskStatus,
  TaskPriority,
} from './tasks.api';

export type {
  InventoryCategory,
  InventoryItem,
  CreateCategoryData,
  CreateItemData,
} from './inventory.api';

export type {
  CalendarEvent,
  CreateEventData,
  EventCategory,
} from './calendar.api';

export type {
  Vehicle,
  MaintenanceRecord,
  FuelLog,
  CreateVehicleData,
  CreateMaintenanceData,
  CreateFuelLogData,
  VehicleType,
} from './vehicles.api';

export type {
  Pet,
  Vaccination,
  Appointment,
  Medication,
  CreatePetData,
  CreateVaccinationData,
  CreateAppointmentData,
  CreateMedicationData,
  PetSpecies,
} from './pets.api';

export type {
  Employee,
  SalaryPayment,
  EmployeeVacation,
  CreateEmployeeData,
  CreatePaymentData,
  CreateVacationData,
} from './employees.api';

export type {
  Recipe,
  RecipeIngredient,
  RecipeInstruction,
  CreateRecipeData,
  CreateIngredientData,
  CreateInstructionData,
} from './recipes.api';

export type {
  ScannedReceipt,
  ScannedReceiptItem,
  CreateReceiptData,
  CreateReceiptItemData,
  BarcodeProduct,
  CreateBarcodeProductData,
} from './scanning.api';

export type {
  DashboardStats,
  ActivityItem,
  UpcomingTask,
  UpcomingEvent,
  ExpiringItem,
  FinanceSummary as DashboardFinanceSummary,
} from './dashboard.api';

export type {
  AdminUser,
  AdminUserDetails,
  HouseholdInfo,
  AuditLog,
  AuditLogQuery,
  AuditLogResponse,
  SystemStats,
  UserRole,
} from './admin.api';

export type {
  Notification,
  NotificationQuery,
  NotificationResponse,
  CreateNotificationData,
  NotificationType,
} from './notifications.api';
