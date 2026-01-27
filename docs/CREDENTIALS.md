# Application Credentials

## Default Login Credentials

These credentials are created by the database seed script (`apps/api/prisma/seed.ts`).

### Admin User

| Field | Value |
|-------|-------|
| **Email** | `admin@household.com` |
| **Password** | `admin123` |
| **Role** | `ADMIN` |
| **Household** | My Household |

---

## Service Credentials

### PostgreSQL Database

| Field | Value |
|-------|-------|
| **Host** | `localhost` |
| **Port** | `5432` |
| **Database** | `household_db` |
| **Username** | `household` |
| **Password** | `household_secret` |
| **Connection URL** | `postgresql://household:household_secret@localhost:5432/household_db?schema=public` |

### Redis

| Field | Value |
|-------|-------|
| **Host** | `localhost` |
| **Port** | `6379` |
| **Password** | `redis_secret` |

### pgAdmin (Database GUI)

| Field | Value |
|-------|-------|
| **URL** | `http://localhost:5050` |
| **Email** | `admin@household.com` |
| **Password** | `admin` |

---

## Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:3001/api/v1 |
| **Swagger Docs** | http://localhost:3001/api/docs |
| **pgAdmin** | http://localhost:5050 |
| **Prisma Studio** | http://localhost:5555 (run `npx prisma studio`) |

---

## How to Create Additional Users

### Via API (POST `/api/v1/auth/register`)

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Via Seed Script

Edit `apps/api/prisma/seed.ts` to add more users, then run:

```bash
cd apps/api
npx prisma db seed
```

---

## User Roles

| Role | Description |
|------|-------------|
| `ADMIN` | Full access to all features including admin panel |
| `PARENT` | Can manage household, assign tasks, manage finances |
| `MEMBER` | Standard household member access |
| `STAFF` | Limited access for household staff/employees |

---

## Important Notes

- These are **development credentials only**
- Change all passwords before deploying to production
- The seed script creates a clean database with only the admin user
- Default inventory categories (Pantry, Refrigerator, Freezer, Cleaning, Bathroom) are also created
