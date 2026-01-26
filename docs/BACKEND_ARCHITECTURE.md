# Backend Architecture Documentation

## Overview

The Household Hero V2 backend is built with **NestJS** framework, using **Prisma ORM** with **PostgreSQL** database, and **Redis** for caching. The architecture follows a modular design pattern where each feature is encapsulated in its own module.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | NestJS | 10.x |
| Language | TypeScript | 5.x |
| ORM | Prisma | 7.x |
| Database | PostgreSQL | 16 |
| Cache | Redis | 7 |
| Authentication | Passport + JWT | - |
| Validation | class-validator | - |
| API Documentation | Swagger (optional) | - |

## Project Structure

```
apps/api/
├── docker/
│   ├── docker-compose.yml    # Docker services configuration
│   └── init.sql              # Database initialization
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Database seeding
├── src/
│   ├── main.ts               # Application entry point
│   ├── app.module.ts         # Root module
│   ├── app.controller.ts     # Health check endpoints
│   ├── common/
│   │   ├── decorators/       # Custom decorators
│   │   ├── guards/           # Authentication guards
│   │   ├── filters/          # Exception filters
│   │   ├── interceptors/     # Response interceptors
│   │   └── pipes/            # Validation pipes
│   ├── config/               # Configuration modules
│   ├── database/             # Database module & Prisma service
│   └── modules/              # Feature modules
│       ├── auth/
│       ├── users/
│       ├── household/
│       ├── tasks/
│       ├── inventory/
│       ├── finance/
│       ├── calendar/
│       ├── vehicles/
│       ├── pets/
│       ├── employees/
│       ├── recipes/
│       ├── scanning/
│       ├── dashboard/
│       ├── admin/
│       └── notifications/
├── test/                     # E2E tests
├── .env                      # Environment variables
├── nest-cli.json             # NestJS CLI configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## Module Architecture

Each module follows a consistent structure:

```
module-name/
├── dto/                      # Data Transfer Objects
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── module-name.controller.ts # HTTP endpoints
├── module-name.service.ts    # Business logic
└── module-name.module.ts     # Module definition
```

## Core Concepts

### 1. Dependency Injection

NestJS uses dependency injection to manage module dependencies:

```typescript
@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
```

### 2. Guards

Guards handle authentication and authorization:

- **JwtAuthGuard**: Validates JWT tokens on protected routes
- **HouseholdGuard**: Ensures user belongs to a household
- **RolesGuard**: Enforces role-based access control (ADMIN, PARENT, MEMBER, STAFF)

### 3. Decorators

Custom decorators for clean controller code:

- `@CurrentUser()`: Extracts current user from request
- `@CurrentUser('id')`: Extracts user ID specifically
- `@Household('id')`: Extracts household ID from request
- `@Roles('ADMIN')`: Specifies required roles
- `@Public()`: Marks endpoint as publicly accessible

### 4. Response Format

All API responses follow a consistent format:

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-26T00:00:00.000Z",
    "path": "/api/v1/endpoint"
  }
}
```

### 5. Error Handling

Errors are handled globally and return consistent format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-01-26T00:00:00.000Z",
  "path": "/api/v1/endpoint"
}
```

## Database Schema

The database uses Prisma ORM with PostgreSQL. Key models include:

- **User & Authentication**: User, UserProfile, Session
- **Household**: Household (all data is scoped by householdId)
- **Tasks**: Task, Subtask, TaskComment, TaskTemplate, Recurrence
- **Inventory**: InventoryCategory, InventoryItem, StockHistory
- **Finance**: Budget, BudgetCategory, Transaction, Bill
- **Calendar**: Event
- **Vehicles**: Vehicle, VehicleInsurance, VehicleMaintenance, FuelLog
- **Pets**: Pet, PetVaccination, PetAppointment, PetMedication
- **Employees**: Employee, SalaryPayment, EmployeeVacation
- **Recipes**: Recipe, RecipeIngredient, RecipeInstruction
- **Scanning**: ScannedReceipt, ScannedReceiptItem, BarcodeProduct
- **System**: AuditLog, Notification

## API Versioning

All endpoints are prefixed with `/api/v1/`:

```typescript
// main.ts
app.setGlobalPrefix('api/v1');
```

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_secret

# App
PORT=3001
NODE_ENV=development
```

## Running the Backend

### Development

```bash
cd apps/api

# Start Docker services
cd docker && docker-compose up -d && cd ..

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

## Available Modules

| Module | Endpoint Prefix | Description |
|--------|-----------------|-------------|
| Auth | `/api/v1/auth` | Authentication & registration |
| Users | `/api/v1/users` | User profile management |
| Household | `/api/v1/household` | Household & member management |
| Tasks | `/api/v1/tasks` | Task management |
| Inventory | `/api/v1/inventory` | Inventory & stock management |
| Finance | `/api/v1/finance` | Budgets & transactions |
| Calendar | `/api/v1/calendar` | Events & scheduling |
| Vehicles | `/api/v1/vehicles` | Vehicle management |
| Pets | `/api/v1/pets` | Pet care management |
| Employees | `/api/v1/employees` | Staff management |
| Recipes | `/api/v1/recipes` | Recipe management |
| Scanning | `/api/v1/scanning` | Receipt & barcode scanning |
| Dashboard | `/api/v1/dashboard` | Dashboard statistics |
| Admin | `/api/v1/admin` | Administration |
| Notifications | `/api/v1/notifications` | User notifications |

## Security

1. **Authentication**: JWT-based with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Data Isolation**: All data is scoped by householdId
4. **Input Validation**: DTOs with class-validator
5. **Password Hashing**: bcryptjs with salt rounds

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```
