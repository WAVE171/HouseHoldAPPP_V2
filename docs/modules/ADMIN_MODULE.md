# Admin Module Documentation

## Overview

The Admin module provides administrative capabilities for household management, including user management, role assignment, account locking, audit logging, and system statistics. Access is restricted to users with the ADMIN role.

## Location

```
apps/api/src/modules/admin/
├── dto/
│   └── admin.dto.ts
├── admin.controller.ts
├── admin.service.ts
└── admin.module.ts
```

## Authorization

All endpoints in this module require:
- Valid JWT authentication
- ADMIN role (enforced by `RolesGuard`)
- Household membership

## Endpoints

### User Management

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

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MEMBER",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+1-555-123-4567",
    "lastLoginAt": "2026-01-26T10:00:00.000Z",
    "isLocked": false,
    "lockedUntil": null,
    "failedLoginAttempts": 0,
    "twoFactorEnabled": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "recentSessions": [
      {
        "id": "clx...",
        "createdAt": "2026-01-26T10:00:00.000Z",
        "expiresAt": "2026-02-02T10:00:00.000Z"
      }
    ]
  }
}
```

#### PATCH `/api/v1/admin/users/:id/role`

Update a user's role.

**Request Body:**
```json
{
  "role": "PARENT"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "role": "PARENT",
    "firstName": "John",
    "lastName": "Doe"
  }
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

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "lockedUntil": "2026-01-27T00:00:00.000Z"
  }
}
```

#### POST `/api/v1/admin/users/:id/unlock`

Unlock a user account.

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "lockedUntil": null
  }
}
```

#### POST `/api/v1/admin/users/:id/revoke-sessions`

Revoke all active sessions for a user.

**Response:**
```json
{
  "data": {
    "success": true,
    "message": "All sessions revoked"
  }
}
```

### Household Management

#### GET `/api/v1/admin/household`

Get detailed household information.

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Smith Family",
    "address": "123 Main Street",
    "phone": "+1-555-123-4567",
    "creatorEmail": "admin@example.com",
    "memberCount": 4,
    "members": [
      {
        "firstName": "John",
        "lastName": "Smith",
        "role": "ADMIN"
      },
      {
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "PARENT"
      }
    ],
    "stats": {
      "tasks": 45,
      "events": 12,
      "inventoryItems": 150,
      "transactions": 230,
      "vehicles": 2,
      "pets": 3,
      "employees": 2,
      "recipes": 25
    },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Audit Logs

#### GET `/api/v1/admin/audit-logs`

Get audit logs with filtering and pagination.

**Query Parameters:**
- `userId` - Filter by user ID
- `action` - Filter by action type
- `resource` - Filter by resource type
- `startDate` - Filter from date
- `endDate` - Filter to date
- `limit` - Number of records (default: 50)
- `offset` - Skip records for pagination

**Response:**
```json
{
  "data": {
    "data": [
      {
        "id": "clx...",
        "userId": "clx...",
        "userEmail": "user@example.com",
        "action": "UPDATE",
        "resource": "USER",
        "resourceId": "clx...",
        "details": { "field": "role", "oldValue": "MEMBER", "newValue": "PARENT" },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2026-01-26T10:00:00.000Z"
      }
    ],
    "meta": {
      "total": 100,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### POST `/api/v1/admin/audit-logs`

Create an audit log entry.

**Request Body:**
```json
{
  "userId": "clx...",
  "userEmail": "user@example.com",
  "action": "CREATE",
  "resource": "TASK",
  "resourceId": "clx...",
  "details": { "title": "New Task" },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### System Statistics

#### GET `/api/v1/admin/system-stats`

Get system-wide statistics (for super admin view).

**Response:**
```json
{
  "data": {
    "totalUsers": 150,
    "totalHouseholds": 45,
    "totalTasks": 1250,
    "totalTransactions": 3500,
    "activeUsersLast24h": 42
  }
}
```

## Enums

### UserRole

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  MEMBER = 'MEMBER',
  STAFF = 'STAFF'
}
```

## Data Models

### AdminUser

```typescript
interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  lastLoginAt?: string;
  isLocked: boolean;
  lockedUntil?: string;
  failedLoginAttempts: number;
  twoFactorEnabled: boolean;
  createdAt: string;
}
```

### AuditLog

```typescript
interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
```

### HouseholdInfo

```typescript
interface HouseholdInfo {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  creatorEmail: string;
  memberCount: number;
  members: { firstName: string; lastName: string; role: UserRole }[];
  stats: {
    tasks: number;
    events: number;
    inventoryItems: number;
    transactions: number;
    vehicles: number;
    pets: number;
    employees: number;
    recipes: number;
  };
  createdAt: string;
}
```

## Service Methods

```typescript
class AdminService {
  // User management
  async getAllUsers(householdId: string): Promise<AdminUser[]>
  async getUserById(userId: string): Promise<AdminUserDetails>
  async updateUserRole(adminId: string, userId: string, newRole: Role): Promise<AdminUser>
  async lockUser(userId: string, lockedUntil?: Date): Promise<{ id: string; email: string; lockedUntil: string }>
  async unlockUser(userId: string): Promise<{ id: string; email: string; lockedUntil: null }>
  async revokeUserSessions(userId: string): Promise<{ success: boolean; message: string }>

  // Household management
  async getHouseholdInfo(householdId: string): Promise<HouseholdInfo>

  // Audit logs
  async getAuditLogs(query: AuditLogQueryDto): Promise<AuditLogResponse>
  async createAuditLog(dto: CreateAuditLogDto): Promise<AuditLog>

  // System stats
  async getSystemStats(): Promise<SystemStats>
}
```

## Frontend Integration

```typescript
// src/shared/api/admin.api.ts
export const adminApi = {
  // User management
  getAllUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: UserRole) => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  lockUser: async (userId: string, lockedUntil?: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/lock`, { lockedUntil });
    return response.data;
  },

  unlockUser: async (userId: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/unlock`);
    return response.data;
  },

  revokeUserSessions: async (userId: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/revoke-sessions`);
    return response.data;
  },

  // Household management
  getHouseholdInfo: async () => {
    const response = await apiClient.get('/admin/household');
    return response.data;
  },

  // Audit logs
  getAuditLogs: async (query?: AuditLogQuery) => {
    const response = await apiClient.get('/admin/audit-logs', { params: query });
    return response.data;
  },

  // System stats
  getSystemStats: async () => {
    const response = await apiClient.get('/admin/system-stats');
    return response.data;
  }
};
```

## Security Considerations

- Admins cannot change their own role (prevents privilege lockout)
- User lock defaults to 24 hours if no duration specified
- Unlocking a user also resets failed login attempts
- All admin actions should be logged in the audit trail

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not an admin or cannot modify self |
| 404 | Not Found | User or resource not found |
