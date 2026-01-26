# Auth Module Documentation

## Overview

The Auth module handles user authentication, registration, and session management using JWT (JSON Web Tokens) with refresh token support.

## Location

```
apps/api/src/modules/auth/
├── dto/
│   ├── login.dto.ts
│   └── register.dto.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── auth.controller.ts
├── auth.service.ts
└── auth.module.ts
```

## Endpoints

### POST `/api/v1/auth/register`

Register a new user and create a household.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "householdName": "My Household"
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "role": "ADMIN",
      "firstName": "John",
      "lastName": "Doe",
      "householdId": "clx...",
      "householdName": "My Household"
    }
  }
}
```

### POST `/api/v1/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "role": "ADMIN",
      "firstName": "John",
      "lastName": "Doe",
      "householdId": "clx...",
      "householdName": "My Household"
    }
  }
}
```

### POST `/api/v1/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

### POST `/api/v1/auth/logout`

Invalidate user session.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

## JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string;       // User ID
  email: string;     // User email
  role: string;      // User role (ADMIN, PARENT, MEMBER, STAFF)
  householdId?: string; // Household ID (if user belongs to one)
  iat: number;       // Issued at
  exp: number;       // Expiration
}
```

## Token Configuration

| Token Type | Default Expiration | Environment Variable |
|------------|-------------------|---------------------|
| Access Token | 15 minutes | `JWT_EXPIRES_IN` |
| Refresh Token | 7 days | `JWT_REFRESH_EXPIRES_IN` |

## Security Features

1. **Password Hashing**: Uses bcryptjs with 10 salt rounds
2. **Failed Login Tracking**: Tracks failed attempts per user
3. **Account Locking**: Locks account after too many failed attempts
4. **Session Management**: Stores sessions in database for revocation

## Service Methods

```typescript
class AuthService {
  // User registration with household creation
  async register(dto: RegisterDto): Promise<AuthResponse>

  // User authentication
  async login(dto: LoginDto): Promise<AuthResponse>

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<TokenResponse>

  // Invalidate session
  async logout(userId: string, token: string): Promise<void>

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<User | null>
}
```

## Frontend Integration

```typescript
// src/shared/api/auth.api.ts
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  }
};
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Account locked |
| 409 | Conflict | Email already exists |
