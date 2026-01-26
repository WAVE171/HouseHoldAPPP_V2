# Users Module Documentation

## Overview

The Users module handles user profile management, including viewing and updating user information and password changes.

## Location

```
apps/api/src/modules/users/
├── dto/
│   ├── update-profile.dto.ts
│   └── change-password.dto.ts
├── users.controller.ts
├── users.service.ts
└── users.module.ts
```

## Endpoints

### GET `/api/v1/users/me`

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "role": "ADMIN",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main St",
    "householdId": "clx...",
    "householdName": "My Household",
    "language": "en",
    "timezone": "America/New_York",
    "theme": "light",
    "twoFactorEnabled": false,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### PATCH `/api/v1/users/me`

Update current user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "avatar": "https://...",
  "language": "pt-PT",
  "timezone": "Africa/Luanda",
  "theme": "dark"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "avatar": "https://...",
    "language": "pt-PT",
    "timezone": "Africa/Luanda",
    "theme": "dark"
  }
}
```

### POST `/api/v1/users/me/change-password`

Change current user's password.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

**Response:**
```json
{
  "data": {
    "message": "Password changed successfully"
  }
}
```

### GET `/api/v1/users/:id`

Get a specific user's public profile (within same household).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "firstName": "Jane",
    "lastName": "Doe",
    "avatar": "https://...",
    "role": "MEMBER"
  }
}
```

## Data Models

### User Profile

```typescript
interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  householdId?: string;
  language: string;     // Default: 'en'
  timezone: string;     // Default: 'UTC'
  theme: string;        // Default: 'light'
  createdAt: string;
  updatedAt: string;
}
```

## Service Methods

```typescript
class UsersService {
  // Get current user profile
  async getProfile(userId: string): Promise<UserProfile>

  // Update user profile
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile>

  // Change password
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void>

  // Get user by ID (public info only)
  async getUserById(userId: string): Promise<PublicUserInfo>
}
```

## Frontend Integration

```typescript
// src/shared/api/users.api.ts (part of auth/household api)
export const usersApi = {
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiClient.patch('/users/me', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post('/users/me/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};
```

## Validation Rules

| Field | Rules |
|-------|-------|
| firstName | Required, 1-100 characters |
| lastName | Required, 1-100 characters |
| phone | Optional, valid phone format |
| avatar | Optional, valid URL |
| language | Optional, ISO language code |
| timezone | Optional, valid timezone |
| theme | Optional, 'light' or 'dark' |
| currentPassword | Required for password change |
| newPassword | Required, min 8 characters |

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Cannot access other user's data |
| 404 | Not Found | User not found |
