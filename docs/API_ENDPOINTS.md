# Household Hero - API Endpoints & Accounts Reference

> **Last Updated:** 2026-02-02
> **API Base URL:** `http://localhost:3001/api/v1`
> **Frontend URL:** `http://localhost:5173`
> **Swagger Docs:** `http://localhost:3001/api/docs`

---

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | `http://localhost:3001` | NestJS API Server |
| Frontend | `http://localhost:5173` | Vite React Application |
| Swagger Docs | `http://localhost:3001/api/docs` | API Documentation |
| Prisma Studio | `http://localhost:5555` | Database GUI |

---

## Database Configuration

| Setting | Value |
|---------|-------|
| Database Type | PostgreSQL |
| Host | `localhost` |
| Port | `5432` |
| Database Name | `household_db` |
| Username | `household` |
| Password | `household_secret` |
| Connection URL | `postgresql://household:household_secret@localhost:5432/household_db?schema=public` |

---

## Test Accounts

| Email | Password | Role | Notes |
|-------|----------|------|-------|
| `test@test.com` | `Test1234` | ADMIN | Test account with household |

---

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | User registration | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | User logout | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user profile | Yes |
| PATCH | `/users/me` | Update current user profile | Yes |
| POST | `/users/me/change-password` | Change password | Yes |
| GET | `/users/:id` | Get user by ID | Yes |

### Household (`/api/v1/household`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/household` | Get current household info | Yes |
| PATCH | `/household` | Update household info | Yes |
| GET | `/household/members` | Get household members | Yes |
| POST | `/household/invite` | Invite member to household | Yes |
| DELETE | `/household/members/:memberId` | Remove member from household | Yes |

### Tasks (`/api/v1/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/tasks` | Create a new task | Yes |
| GET | `/tasks` | Get all tasks | Yes |
| GET | `/tasks/:id` | Get task by ID | Yes |
| PATCH | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |

### Finance (`/api/v1/finance`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/finance/transactions` | Create transaction | Yes |
| GET | `/finance/transactions` | Get all transactions | Yes |
| GET | `/finance/transactions/:id` | Get transaction by ID | Yes |
| PATCH | `/finance/transactions/:id` | Update transaction | Yes |
| DELETE | `/finance/transactions/:id` | Delete transaction | Yes |
| POST | `/finance/budgets` | Create budget | Yes |
| GET | `/finance/budgets` | Get all budgets | Yes |
| GET | `/finance/budgets/:id` | Get budget by ID | Yes |
| DELETE | `/finance/budgets/:id` | Delete budget | Yes |
| GET | `/finance/summary` | Get finance summary | Yes |

### Inventory (`/api/v1/inventory`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/inventory/categories` | Create category | Yes |
| GET | `/inventory/categories` | Get all categories | Yes |
| DELETE | `/inventory/categories/:id` | Delete category | Yes |
| POST | `/inventory/items` | Create inventory item | Yes |
| GET | `/inventory/items` | Get all inventory items | Yes |
| GET | `/inventory/items/:id` | Get item by ID | Yes |
| PATCH | `/inventory/items/:id` | Update item | Yes |
| DELETE | `/inventory/items/:id` | Delete item | Yes |

### Calendar (`/api/v1/calendar`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/calendar/events` | Create event | Yes |
| GET | `/calendar/events` | Get all events | Yes |
| GET | `/calendar/events/:id` | Get event by ID | Yes |
| PATCH | `/calendar/events/:id` | Update event | Yes |
| DELETE | `/calendar/events/:id` | Delete event | Yes |

### Vehicles (`/api/v1/vehicles`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/vehicles` | Add vehicle | Yes |
| GET | `/vehicles` | Get all vehicles | Yes |
| GET | `/vehicles/:id` | Get vehicle by ID | Yes |
| PATCH | `/vehicles/:id` | Update vehicle | Yes |
| DELETE | `/vehicles/:id` | Delete vehicle | Yes |
| POST | `/vehicles/:id/maintenance` | Add maintenance record | Yes |
| GET | `/vehicles/:id/maintenance` | Get maintenance records | Yes |
| POST | `/vehicles/:id/fuel` | Add fuel record | Yes |
| GET | `/vehicles/:id/fuel` | Get fuel records | Yes |

### Pets (`/api/v1/pets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/pets` | Add pet | Yes |
| GET | `/pets` | Get all pets | Yes |
| GET | `/pets/:id` | Get pet by ID | Yes |
| PATCH | `/pets/:id` | Update pet | Yes |
| DELETE | `/pets/:id` | Delete pet | Yes |
| POST | `/pets/:id/vaccinations` | Add vaccination | Yes |
| GET | `/pets/:id/vaccinations` | Get vaccinations | Yes |
| POST | `/pets/:id/appointments` | Add vet appointment | Yes |
| GET | `/pets/:id/appointments` | Get vet appointments | Yes |
| POST | `/pets/:id/medications` | Add medication | Yes |
| GET | `/pets/:id/medications` | Get medications | Yes |

### Employees (`/api/v1/employees`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/employees` | Add employee | Yes |
| GET | `/employees` | Get all employees | Yes |
| GET | `/employees/:id` | Get employee by ID | Yes |
| PATCH | `/employees/:id` | Update employee | Yes |
| DELETE | `/employees/:id` | Delete employee | Yes |

### Recipes (`/api/v1/recipes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/recipes` | Create recipe | Yes |
| GET | `/recipes` | Get all recipes | Yes |
| GET | `/recipes/:id` | Get recipe by ID | Yes |
| PATCH | `/recipes/:id` | Update recipe | Yes |
| DELETE | `/recipes/:id` | Delete recipe | Yes |

### Kids (`/api/v1/kids`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/kids` | Add child | Yes |
| GET | `/kids` | Get all children | Yes |
| GET | `/kids/:id` | Get child by ID | Yes |
| PATCH | `/kids/:id` | Update child | Yes |
| DELETE | `/kids/:id` | Delete child | Yes |

### Scanning (`/api/v1/scanning`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/scanning/receipts` | Upload receipt | Yes |
| GET | `/scanning/receipts` | Get all receipts | Yes |
| GET | `/scanning/receipts/:id` | Get receipt by ID | Yes |
| DELETE | `/scanning/receipts/:id` | Delete receipt | Yes |
| POST | `/scanning/receipts/:id/link-transaction` | Link receipt to transaction | Yes |
| POST | `/scanning/receipts/:id/add-to-inventory` | Add receipt items to inventory | Yes |
| POST | `/scanning/receipts/:id/create-transaction` | Create transaction from receipt | Yes |
| POST | `/scanning/barcode/lookup` | Lookup product by barcode | Yes |
| POST | `/scanning/barcode/products` | Add product from barcode | Yes |

### Dashboard (`/api/v1/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/stats` | Get dashboard statistics | Yes |
| GET | `/dashboard/recent-activity` | Get recent activity | Yes |
| GET | `/dashboard/upcoming-tasks` | Get upcoming tasks | Yes |
| GET | `/dashboard/upcoming-events` | Get upcoming events | Yes |
| GET | `/dashboard/expiring-items` | Get expiring inventory items | Yes |
| GET | `/dashboard/finance-summary` | Get finance summary | Yes |

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get all notifications | Yes |
| GET | `/notifications/unread-count` | Get unread count | Yes |
| GET | `/notifications/:id` | Get notification by ID | Yes |
| POST | `/notifications` | Create notification | Yes |
| PATCH | `/notifications/:id/read` | Mark as read | Yes |
| POST | `/notifications/mark-all-read` | Mark all as read | Yes |
| DELETE | `/notifications/:id` | Delete notification | Yes |
| DELETE | `/notifications/read/all` | Delete all read notifications | Yes |

### Admin (`/api/v1/admin`)

#### Household Admin Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/users` | Get household users | Yes | ADMIN+ |
| GET | `/admin/users/:id` | Get user by ID | Yes | ADMIN+ |
| PATCH | `/admin/users/:id/role` | Update user role | Yes | ADMIN+ |
| POST | `/admin/users/:id/lock` | Lock user account | Yes | ADMIN+ |
| POST | `/admin/users/:id/unlock` | Unlock user account | Yes | ADMIN+ |
| POST | `/admin/users/:id/revoke-sessions` | Revoke user sessions | Yes | ADMIN+ |
| GET | `/admin/household` | Get household info | Yes | ADMIN+ |
| GET | `/admin/audit-logs` | Get audit logs | Yes | ADMIN+ |
| POST | `/admin/audit-logs` | Create audit log | Yes | ADMIN+ |

#### Super Admin Endpoints (SUPER_ADMIN only)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/system/stats` | Get system-wide statistics | Yes | SUPER_ADMIN |
| GET | `/admin/households` | Get all households | Yes | SUPER_ADMIN |
| POST | `/admin/households` | Create new household | Yes | SUPER_ADMIN |
| GET | `/admin/households/:id` | Get household by ID | Yes | SUPER_ADMIN |
| PATCH | `/admin/households/:id` | Update household | Yes | SUPER_ADMIN |
| DELETE | `/admin/households/:id` | Delete household | Yes | SUPER_ADMIN |
| GET | `/admin/households/:id/members` | Get household members | Yes | SUPER_ADMIN |
| POST | `/admin/households/:id/admin` | Assign household admin | Yes | SUPER_ADMIN |
| GET | `/admin/system/users` | Get all system users | Yes | SUPER_ADMIN |

---

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `SUPER_ADMIN` | System Administrator | Full platform access, manage all households |
| `ADMIN` | Household Administrator | Manage household settings and members |
| `PARENT` | Parent/Guardian | Manage members, invite users, limited settings |
| `MEMBER` | Household Member | View and interact with household data |
| `STAFF` | Household Staff | Limited access (employees view) |

---

## Environment Variables

### Backend (.env)

```env
# Database
POSTGRES_USER=household
POSTGRES_PASSWORD=household_secret
POSTGRES_DB=household_db
DATABASE_URL="postgresql://household:household_secret@localhost:5432/household_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_secret

# JWT
JWT_SECRET=household-hero-jwt-secret-key-dev-only-change-in-prod
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=household-hero-refresh-secret-key-dev-only-change
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3001
API_PREFIX=api/v1
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api/v1
```

---

## Notes

- All authenticated endpoints require a valid JWT token in the `Authorization` header: `Bearer <token>`
- Tokens expire after 15 minutes; use the refresh token to obtain a new access token
- The API wraps all responses in `{ data: ..., meta: { timestamp, path } }` format
- Validation errors return status 400 with message array
- Unauthorized requests return status 401
- Forbidden requests return status 403

---

*This document is automatically maintained. When adding new modules, update this file with the new endpoints.*
