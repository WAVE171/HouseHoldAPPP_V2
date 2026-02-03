# Admin Module Documentation

## Overview

The Admin module provides comprehensive administrative capabilities at two levels:
1. **Household Admin (ADMIN role)** - Manages users and settings within their household
2. **Super Admin (SUPER_ADMIN role)** - Manages the entire platform, all households, and system operations

## Location

```
apps/api/src/modules/admin/
├── dto/
│   └── admin.dto.ts
├── admin.controller.ts
├── admin.service.ts
├── impersonation.service.ts    # NEW: User impersonation for support
└── admin.module.ts
```

## Role Hierarchy

| Role | Scope | Capabilities |
|------|-------|--------------|
| `SUPER_ADMIN` | Platform | Manage all households, system stats, impersonation |
| `ADMIN` | Household | Manage household members, settings, audit logs |
| `PARENT` | Household | Manage members, send invites |
| `MEMBER` | Household | View and interact with data |
| `STAFF` | Household | Limited employee access |

---

## Super Admin Features

### System Dashboard

Super Admins see platform-wide operational metrics:

| Metric | Description |
|--------|-------------|
| Total Households | Count of all households on the platform |
| Active Households | Households with login activity in last 30 days |
| Total Users | Count of all registered users |
| Active Users (24h) | Users who logged in within 24 hours |
| New Signups (7 days) | New user registrations this week |
| Suspended Households | Households currently in read-only mode |

### Household Management

Super Admins can:
- View all households with summary information (no private data)
- Create new households with initial admin
- Suspend/unsuspend households (puts them in read-only mode)
- Assign or change household administrators

**Privacy Principle:** Super Admins see COUNTS, not CONTENT. They can see "15 tasks" but not "Buy groceries for mom's birthday".

### User Impersonation

For support purposes, Super Admins can temporarily impersonate any user:
- Time-limited sessions (configurable, default 30 minutes)
- All actions logged with impersonation flag
- Visual banner shown during impersonation
- Original session preserved and restored on end

### Password Reset

Super Admins can reset any user's password:
- Generate temporary password
- Force password change on next login

---

## Household Suspension System

### Overview

Suspended households operate in **read-only mode**:
- Members can log in and view all their data
- Cannot create, update, or delete anything
- Shows suspension banner with support contact
- Admin can view but not modify

### Use Cases
- Payment issues or billing disputes
- Policy violations under review
- Account security concerns
- Compliance audits

### Implementation

**Database:** `Household.status` enum: `ACTIVE`, `SUSPENDED`, `INACTIVE`

**Backend Guard:** `SuspensionGuard` checks household status before write operations

**Frontend Banner:** `SuspensionBanner` component displays warning to suspended users

---

## Endpoints

### Household Admin Endpoints

#### GET `/api/v1/admin/users`

Get all users in the household.

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER",
      "avatar": "https://example.com/avatar.jpg",
      "lastLoginAt": "2026-01-26T10:00:00.000Z",
      "isLocked": false,
      "lockedUntil": null,
      "failedLoginAttempts": 0,
      "twoFactorEnabled": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/v1/admin/users/:id`

Get detailed information about a specific user.

#### PATCH `/api/v1/admin/users/:id/role`

Update a user's role within the household.

**Request Body:**
```json
{
  "role": "PARENT"
}
```

#### POST `/api/v1/admin/users/:id/lock`

Lock a user account.

**Request Body:**
```json
{
  "lockedUntil": "2026-01-27T00:00:00.000Z"
}
```

#### POST `/api/v1/admin/users/:id/unlock`

Unlock a user account.

#### POST `/api/v1/admin/users/:id/revoke-sessions`

Revoke all active sessions for a user.

#### GET `/api/v1/admin/household`

Get household stats (for Household Admin view).

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Smith Family",
    "memberCount": 4,
    "stats": {
      "tasks": 45,
      "events": 12,
      "inventoryItems": 150,
      "transactions": 230,
      "vehicles": 2,
      "pets": 3,
      "employees": 2,
      "recipes": 25
    }
  }
}
```

#### GET `/api/v1/admin/audit-logs`

Get audit logs with filtering.

**Query Parameters:**
- `userId` - Filter by user ID
- `action` - Filter by action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
- `resource` - Filter by resource type
- `startDate`, `endDate` - Date range filter
- `limit`, `offset` - Pagination

---

### Super Admin Endpoints

#### GET `/api/v1/admin/system/stats`

Get platform-wide statistics.

**Response:**
```json
{
  "data": {
    "totalHouseholds": 150,
    "activeHouseholds": 120,
    "suspendedHouseholds": 5,
    "totalUsers": 450,
    "activeUsersLast24h": 85,
    "newUsersLast7Days": 23,
    "newHouseholdsLast30Days": 12
  }
}
```

#### GET `/api/v1/admin/households`

Get all households (paginated).

**Query Parameters:**
- `page`, `limit` - Pagination
- `search` - Search by name or admin email
- `status` - Filter by ACTIVE, SUSPENDED, INACTIVE

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Smith Family",
      "adminEmail": "admin@smith.com",
      "memberCount": 4,
      "status": "ACTIVE",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "lastActiveAt": "2026-02-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

#### POST `/api/v1/admin/households`

Create a new household with initial admin.

**Request Body:**
```json
{
  "name": "New Family",
  "address": "123 Main St",
  "adminEmail": "admin@newfamily.com",
  "adminFirstName": "John",
  "adminLastName": "New",
  "adminPassword": "SecurePassword123"
}
```

#### GET `/api/v1/admin/households/:id`

Get household details (summary only, no private content).

#### PATCH `/api/v1/admin/households/:id`

Update household information.

#### POST `/api/v1/admin/households/:id/suspend`

Suspend a household (puts in read-only mode).

**Request Body:**
```json
{
  "reason": "Payment overdue"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "status": "SUSPENDED",
    "suspendedAt": "2026-02-02T10:00:00.000Z",
    "suspendedReason": "Payment overdue"
  }
}
```

#### POST `/api/v1/admin/households/:id/unsuspend`

Reactivate a suspended household.

#### GET `/api/v1/admin/system/users`

Get all users across all households.

**Query Parameters:**
- `page`, `limit` - Pagination
- `search` - Search by name or email
- `role` - Filter by role
- `householdId` - Filter by household

#### POST `/api/v1/admin/system/users/:id/reset-password`

Reset a user's password.

**Request Body:**
```json
{
  "newPassword": "TempPassword123"
}
```

**Response:**
```json
{
  "data": {
    "userId": "clx...",
    "email": "user@example.com",
    "tempPassword": "TempPassword123",
    "message": "Password reset successfully. User must change on next login."
  }
}
```

---

### Impersonation Endpoints

#### POST `/api/v1/admin/impersonate/:userId`

Start impersonating a user.

**Response:**
```json
{
  "data": {
    "impersonationToken": "eyJ...",
    "expiresIn": 1800,
    "targetUser": {
      "id": "clx...",
      "email": "user@example.com",
      "role": "MEMBER",
      "firstName": "John",
      "lastName": "Doe",
      "householdId": "clx...",
      "householdName": "Smith Family"
    },
    "impersonationLogId": "clx..."
  }
}
```

#### POST `/api/v1/admin/impersonate/:sessionId/end`

End an impersonation session.

**Response:**
```json
{
  "data": {
    "message": "Impersonation ended successfully",
    "duration": 450,
    "actionsCount": 5
  }
}
```

#### GET `/api/v1/admin/impersonate/sessions`

Get currently active impersonation sessions.

#### GET `/api/v1/admin/impersonate/history`

Get impersonation history with filters.

**Query Parameters:**
- `superAdminId` - Filter by Super Admin
- `targetUserId` - Filter by impersonated user
- `startDate`, `endDate` - Date range
- `limit`, `offset` - Pagination

---

## Frontend Components

### Super Admin View

```
src/features/admin/
├── pages/
│   └── AdminPage.tsx              # Main admin page with role-based views
├── components/
│   ├── SystemDashboard.tsx        # Platform-wide metrics
│   ├── HouseholdManagement.tsx    # Household list and management (with suspend/unsuspend)
│   ├── UserManagement.tsx         # User list with actions
│   ├── AuditLogList.tsx           # Audit log viewer
│   ├── ImpersonationHistory.tsx   # Impersonation session history viewer
│   ├── ImpersonationBanner.tsx    # Shows during impersonation
│   ├── SuspensionBanner.tsx       # Shows for suspended households
│   ├── AddHouseholdDialog.tsx     # Create new household form
│   ├── HouseholdDetailsDialog.tsx # View/edit household details
│   └── AdminStatsCards.tsx        # Household-level stats cards
└── types/
    └── admin.types.ts             # TypeScript types
```

### ImpersonationBanner

Displayed at top of screen during impersonation:
- Shows target user name, email, role
- "End Impersonation" button
- Visual indicator (purple/warning color)

### SuspensionBanner

Displayed for suspended household members:
- Warning message about read-only mode
- Contact support link
- Cannot be dismissed

---

## Auth Store Integration

The auth store (`src/features/auth/store/authStore.ts`) includes impersonation state:

```typescript
interface ImpersonationState {
  isImpersonating: boolean;
  originalToken: string | null;
  originalUser: User | null;
  impersonationLogId: string | null;
  targetUser: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    householdId?: string;
    householdName?: string;
  } | null;
}

// Actions
startImpersonation(token, targetUser, logId): void
endImpersonation(): void
```

---

## Database Models

### ImpersonationLog

```prisma
model ImpersonationLog {
  id                String    @id @default(cuid())
  superAdminId      String
  superAdmin        User      @relation("ImpersonationBySuperAdmin", ...)
  targetUserId      String
  targetUser        User      @relation("ImpersonatedUser", ...)
  targetHouseholdId String?
  startedAt         DateTime  @default(now())
  endedAt           DateTime?
  reason            String?
  actionsCount      Int       @default(0)

  @@index([superAdminId])
  @@index([targetUserId])
  @@index([startedAt])
  @@map("impersonation_logs")
}
```

### Household Status

```prisma
model Household {
  // ... existing fields
  status        HouseholdStatus @default(ACTIVE)
  suspendedAt   DateTime?
  suspendedBy   String?
  suspendReason String?
}

enum HouseholdStatus {
  ACTIVE
  SUSPENDED
  INACTIVE
}
```

---

## Service Methods

### AdminService

```typescript
class AdminService {
  // Household Admin Methods
  async getAllUsers(householdId: string): Promise<AdminUser[]>
  async getUserById(userId: string): Promise<AdminUserDetails>
  async updateUserRole(adminId: string, userId: string, newRole: Role): Promise<AdminUser>
  async lockUser(userId: string, lockedUntil?: Date): Promise<User>
  async unlockUser(userId: string): Promise<User>
  async revokeUserSessions(userId: string): Promise<void>
  async getHouseholdStats(householdId: string): Promise<HouseholdStats>
  async getAuditLogs(query: AuditLogQueryDto): Promise<PaginatedResponse<AuditLog>>

  // Super Admin Methods
  async getSystemStats(): Promise<SystemStats>
  async getAllHouseholds(query: HouseholdQueryDto): Promise<PaginatedResponse<Household>>
  async createHousehold(dto: CreateHouseholdDto): Promise<Household>
  async getHouseholdById(id: string): Promise<HouseholdDetails>
  async updateHousehold(id: string, dto: UpdateHouseholdDto): Promise<Household>
  async suspendHousehold(id: string, reason?: string): Promise<Household>
  async unsuspendHousehold(id: string): Promise<Household>
  async getAllUsersSystemWide(query: UserQueryDto): Promise<PaginatedResponse<User>>
  async resetUserPassword(userId: string, newPassword?: string): Promise<PasswordResetResult>
}
```

### ImpersonationService

```typescript
class ImpersonationService {
  async startImpersonation(superAdminId: string, targetUserId: string): Promise<ImpersonationResult>
  async endImpersonation(sessionId: string): Promise<void>
  async getActiveSessions(): Promise<ImpersonationSession[]>
  async getImpersonationHistory(query: HistoryQueryDto): Promise<PaginatedResponse<ImpersonationLog>>
}
```

---

## Security Considerations

1. **Role Enforcement**
   - Super Admin endpoints require SUPER_ADMIN role
   - Household Admin endpoints require ADMIN role within the household
   - Guards validate role before processing

2. **Impersonation Security**
   - Time-limited tokens (default 30 minutes)
   - All actions logged with impersonation context
   - Cannot impersonate other Super Admins
   - Original session preserved and restored

3. **Suspension Guard**
   - Checks household status before write operations
   - Returns 403 Forbidden for suspended households
   - Read operations still allowed

4. **Audit Trail**
   - All admin actions logged
   - Impersonation sessions tracked
   - IP address and user agent recorded

5. **Data Privacy**
   - Super Admins see aggregated counts, not content
   - Cannot view transaction details, task content, etc.
   - Only operational metrics exposed

---

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Insufficient role or household suspended |
| 404 | Not Found | User or household not found |
| 409 | Conflict | Cannot modify own role/lock self |

---

## Frontend API Client

```typescript
// src/shared/api/admin.api.ts
export const adminApi = {
  // Household Admin
  getUsers: () => Promise<SystemUser[]>,
  lockUser: (userId: string) => Promise<void>,
  unlockUser: (userId: string) => Promise<void>,
  getHouseholdStats: () => Promise<SystemStats>,
  getAuditLogs: (query?: AuditLogQuery) => Promise<PaginatedResponse<AuditLog>>,

  // Super Admin
  getSystemStats: () => Promise<SystemStats>,
  getAllHouseholds: (query?: HouseholdQuery) => Promise<PaginatedResponse<Household>>,
  createHousehold: (data: CreateHouseholdDto) => Promise<Household>,
  suspendHousehold: (id: string, reason?: string) => Promise<Household>,
  unsuspendHousehold: (id: string) => Promise<Household>,
  getAllUsersSystemWide: () => Promise<SystemUser[]>,
  resetUserPassword: (userId: string, newPassword?: string) => Promise<PasswordResetResult>,

  // Impersonation
  startImpersonation: (userId: string) => Promise<ImpersonationResponse>,
  endImpersonation: (sessionId: string) => Promise<void>,
  getActiveSessions: () => Promise<ImpersonationSession[]>,
  getImpersonationHistory: (query?: HistoryQuery) => Promise<ImpersonationHistoryResponse>,
};
```

---

*Last Updated: February 3, 2026*

---

## Mock Data for Frontend Testing

The admin module includes comprehensive mock data for frontend-only development:

**Test Credentials:**
| Email | Password | Role |
|-------|----------|------|
| `superadmin@example.com` | `password123` | SUPER_ADMIN |
| `admin@example.com` | `password123` | ADMIN |
| `parent@example.com` | `password123` | PARENT |
| `member@example.com` | `password123` | MEMBER |

**Mock Data Includes:**
- 3 test households (Smith Family, Johnson Residence, Garcia Family)
- 4 system-wide users
- 3 audit log entries
- 2 impersonation history records
- Dashboard statistics and metrics

To switch between mock and real API, set `USE_MOCK_API` in `src/shared/api/admin.api.ts`.
