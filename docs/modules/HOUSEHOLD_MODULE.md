# Household Module Documentation

## Overview

The Household module manages household information and member management. All data in the application is scoped by household, ensuring data isolation between different households.

## Location

```
apps/api/src/modules/household/
├── dto/
│   ├── update-household.dto.ts
│   └── invite-member.dto.ts
├── household.controller.ts
├── household.service.ts
└── household.module.ts
```

## Endpoints

### GET `/api/v1/household`

Get current household information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "My Household",
    "address": "123 Main Street",
    "phone": "+1234567890",
    "creatorId": "clx...",
    "memberCount": 4,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-15T00:00:00.000Z"
  }
}
```

### PATCH `/api/v1/household`

Update household information. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Smith Family",
  "address": "456 Oak Avenue",
  "phone": "+0987654321"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "name": "Smith Family",
    "address": "456 Oak Avenue",
    "phone": "+0987654321",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

### GET `/api/v1/household/members`

Get all members of the household.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "userId": "clx...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "avatar": "https://..."
    },
    {
      "id": "clx...",
      "userId": "clx...",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "PARENT",
      "avatar": "https://..."
    }
  ]
}
```

### POST `/api/v1/household/invite`

Invite a new member to the household. **Requires ADMIN or PARENT role.**

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "role": "MEMBER"
}
```

**Response:**
```json
{
  "data": {
    "inviteId": "clx...",
    "email": "newmember@example.com",
    "role": "MEMBER",
    "expiresAt": "2026-02-02T00:00:00.000Z"
  }
}
```

### DELETE `/api/v1/household/members/:memberId`

Remove a member from the household. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "message": "Member removed successfully"
  }
}
```

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| ADMIN | Full access, can manage household settings and all members |
| PARENT | Can invite members, manage children's data |
| MEMBER | Standard access to household data |
| STAFF | Limited access, typically for household employees |

## Data Models

### Household

```typescript
interface Household {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Household Member

```typescript
interface HouseholdMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'STAFF';
  avatar?: string;
}
```

## Service Methods

```typescript
class HouseholdService {
  // Get household by ID
  async getHousehold(householdId: string): Promise<Household>

  // Update household
  async updateHousehold(householdId: string, dto: UpdateHouseholdDto): Promise<Household>

  // Get all members
  async getMembers(householdId: string): Promise<HouseholdMember[]>

  // Invite new member
  async inviteMember(householdId: string, dto: InviteMemberDto): Promise<Invite>

  // Remove member
  async removeMember(householdId: string, memberId: string): Promise<void>
}
```

## Frontend Integration

```typescript
// src/shared/api/household.api.ts
export const householdApi = {
  getHousehold: async () => {
    const response = await apiClient.get('/household');
    return response.data;
  },

  updateHousehold: async (data: UpdateHouseholdData) => {
    const response = await apiClient.patch('/household', data);
    return response.data;
  },

  getMembers: async () => {
    const response = await apiClient.get('/household/members');
    return response.data;
  },

  inviteMember: async (email: string, role: string) => {
    const response = await apiClient.post('/household/invite', { email, role });
    return response.data;
  },

  removeMember: async (memberId: string) => {
    await apiClient.delete(`/household/members/${memberId}`);
  }
};
```

## Data Scoping

All data in the application is scoped by `householdId`:

```typescript
// Example: Getting tasks for a household
const tasks = await prisma.task.findMany({
  where: { householdId: user.householdId }
});
```

The `HouseholdGuard` automatically validates that users belong to a household and attaches the `householdId` to the request:

```typescript
@Controller('tasks')
@UseGuards(JwtAuthGuard, HouseholdGuard)
export class TasksController {
  @Get()
  getTasks(@Household('id') householdId: string) {
    return this.tasksService.findAll(householdId);
  }
}
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Household or member not found |
| 409 | Conflict | Member already exists |
