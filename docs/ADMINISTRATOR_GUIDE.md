# Household Hero - Administrator Guide

> **Version:** 1.0
> **Last Updated:** February 2, 2026
> **Audience:** Household Admins and Super Admins

---

## Table of Contents

1. [Introduction](#introduction)
2. [Role Overview](#role-overview)
3. [Household Admin Guide](#household-admin-guide)
4. [Super Admin Guide](#super-admin-guide)
5. [Application Architecture](#application-architecture)
6. [Known Issues & Bug Fixes](#known-issues--bug-fixes)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Maintenance Tasks](#maintenance-tasks)
9. [Security Best Practices](#security-best-practices)

---

## Introduction

This guide is for administrators managing the Household Hero application. It covers:
- **Household Admins**: Managing your household, members, and settings
- **Super Admins**: Managing the entire platform, all households, and system operations

---

## Role Overview

### Role Hierarchy

```
SUPER_ADMIN (Platform)
    └── ADMIN (Household)
        └── PARENT
            └── MEMBER
                └── STAFF
```

### Capabilities Matrix

| Feature | SUPER_ADMIN | ADMIN | PARENT | MEMBER | STAFF |
|---------|-------------|-------|--------|--------|-------|
| System Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage All Households | ✅ | ❌ | ❌ | ❌ | ❌ |
| Suspend Households | ✅ | ❌ | ❌ | ❌ | ❌ |
| Impersonate Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Household Settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Members | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Audit Logs | ✅ | ✅ | ❌ | ❌ | ❌ |
| Invite Users | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Finance | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Tasks | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Own Data | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Household Admin Guide

### Accessing Admin Panel

1. Log in with your Admin account
2. Navigate to **"Admin"** in the sidebar
3. You'll see tabs for: Members, Activity Log

### Managing Members

#### View All Members
- See list of all household members
- View roles, status, last login
- Search by name or email

#### Change Member Role
1. Find the member in the list
2. Click the menu (⋮) button
3. Select the new role
4. Confirm the change

**Note:** You cannot change your own role to prevent lockout.

#### Lock/Unlock Accounts
1. Find the member
2. Click menu (⋮) → "Lock Account"
3. Optionally set lock duration
4. User cannot log in until unlocked

To unlock:
1. Find the locked member
2. Click menu (⋮) → "Unlock Account"

#### Remove a Member
1. Navigate to Settings → Household
2. Find the member
3. Click "Remove from Household"
4. Confirm removal

**Warning:** This action cannot be undone. The user loses access immediately.

### Inviting New Members

1. Go to Settings → Household → Members
2. Click **"Invite Member"**
3. Enter:
   - Email address
   - Role to assign
4. Click "Send Invitation"
5. User receives email with link

### Viewing Activity Logs

The audit log tracks all actions in your household:

**Logged Actions:**
- User logins/logouts
- Data creation/updates/deletions
- Role changes
- Account locks/unlocks
- Settings changes

**Filtering Logs:**
- By user
- By action type (CREATE, UPDATE, DELETE, LOGIN)
- By date range
- By resource type

### Household Statistics

View household metrics:
- Total members
- Task completion rates
- Inventory status
- Budget overview
- Activity trends

---

## Super Admin Guide

### System Dashboard

Access via: Admin → Dashboard

**Key Metrics:**
| Metric | Description |
|--------|-------------|
| Total Households | All registered households |
| Active Households | Activity in last 30 days |
| Suspended Households | Currently in read-only mode |
| Total Users | All registered users |
| Active Users (24h) | Logged in within 24 hours |
| New Users (7 days) | Registrations this week |

### Household Management

#### Viewing All Households

1. Go to Admin → Households
2. See list with:
   - Household name
   - Primary admin email
   - Member count
   - Status (Active/Suspended)
   - Last activity date

3. Use filters:
   - Search by name or admin email
   - Filter by status
   - Sort by date or activity

#### Creating a New Household

1. Click **"+ Create Household"**
2. Enter household details:
   - Name
   - Address (optional)
   - Phone (optional)
3. Create initial admin:
   - Email
   - First/Last name
   - Temporary password
4. Click "Create"
5. Admin receives welcome email

#### Suspending a Household

**When to Suspend:**
- Payment issues
- Policy violations
- Security concerns
- Account review needed

**How to Suspend:**
1. Find household in list
2. Click menu (⋮) → "Suspend"
3. Enter reason (for audit log)
4. Confirm suspension

**What Happens:**
- Members see "Read-Only Mode" banner
- All write operations blocked
- Data remains accessible for viewing
- Audit logs continue recording

#### Unsuspending a Household

1. Find suspended household
2. Click menu (⋮) → "Unsuspend"
3. Confirm action
4. Household returns to normal operation

### User Management (System-Wide)

#### Finding Users

1. Go to Admin → Users
2. Search by name or email
3. Filter by:
   - Role
   - Household
   - Account status (locked/active)

#### Resetting User Password

1. Find user in list
2. Click menu (⋮) → "Reset Password"
3. Optionally enter new password
4. If blank, system generates temporary password
5. User must change on next login

#### Locking/Unlocking Users

Same as Household Admin, but works across all users.

### User Impersonation

**Purpose:** Support users by viewing their experience

**Starting Impersonation:**
1. Find user in Users tab
2. Click menu (⋮) → "Impersonate"
3. Confirm action
4. You now see the app as that user

**During Impersonation:**
- Purple banner shows at top
- Banner shows target user info
- All actions logged with "[IMPERSONATED]" flag
- Session limited to 30 minutes

**Ending Impersonation:**
1. Click "End Impersonation" in banner
2. Or wait for session timeout
3. Returned to Super Admin view

**What You CAN See:**
- Everything the user sees
- Their tasks, events, data
- Their household data

**What's Logged:**
- Impersonation start time
- All actions taken
- Impersonation end time
- Duration and action count

**Security Rules:**
- Cannot impersonate other Super Admins
- Cannot change critical settings while impersonating
- All actions attributable in audit logs

---

## Application Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| UI Components | shadcn/ui, Tailwind CSS |
| State Management | Zustand |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT (Access + Refresh tokens) |
| Caching | Redis (optional) |

### Project Structure

```
HouseHoldAPPP_V2/
├── apps/
│   └── api/                    # Backend NestJS application
│       ├── src/
│       │   ├── common/         # Guards, decorators, filters
│       │   ├── database/       # Prisma service
│       │   └── modules/        # Feature modules
│       │       ├── auth/
│       │       ├── admin/
│       │       ├── finance/
│       │       ├── tasks/
│       │       ├── inventory/
│       │       ├── calendar/
│       │       ├── vehicles/
│       │       ├── pets/
│       │       ├── employees/
│       │       ├── recipes/
│       │       ├── kids/
│       │       ├── scanning/
│       │       ├── dashboard/
│       │       └── notifications/
│       └── prisma/
│           └── schema.prisma   # Database schema
│
├── src/                        # Frontend React application
│   ├── features/               # Feature modules
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── finance/
│   │   └── ...
│   └── shared/
│       ├── api/                # API clients
│       ├── components/         # Shared UI components
│       └── hooks/              # Custom React hooks
│
└── docs/                       # Documentation
```

### Authentication Flow

```
1. User submits credentials
       ↓
2. Backend validates credentials
       ↓
3. Backend returns:
   - Access token (15 min expiry)
   - Refresh token (7 day expiry)
       ↓
4. Frontend stores tokens
       ↓
5. Access token sent with each request
       ↓
6. When access token expires:
   - Frontend uses refresh token
   - Gets new access token
       ↓
7. When refresh token expires:
   - User must log in again
```

### Database Schema Overview

**Core Models:**
- User, UserProfile
- Household, HouseholdInvitation
- RefreshToken, AuditLog

**Feature Models:**
- Task, TaskComment
- Transaction, Budget
- InventoryItem, InventoryCategory
- Event
- Vehicle, MaintenanceRecord, FuelLog
- Pet, PetVaccination, PetAppointment
- Employee
- Recipe
- Kid
- ScannedReceipt, Product
- Notification

**Admin Models:**
- Subscription, Payment
- ImpersonationLog

---

## Known Issues & Bug Fixes

### Current Known Issues

#### Issue #1: Dashboard Uses Mock Data
**Status:** Medium Priority
**Description:** The dashboard page displays static mock data instead of real API data.
**Location:** `src/features/dashboard/pages/DashboardPage.tsx`
**Workaround:** Data in other modules (Tasks, Finance, etc.) is real.
**Fix:** Replace mock imports with `dashboardApi` calls.

#### Issue #2: Tasks Types in Mocks Folder
**Status:** Low Priority
**Description:** Task type definitions are imported from mocks folder.
**Location:** `src/features/tasks/pages/TasksPage.tsx`
**Impact:** Works correctly but improper code organization.
**Fix:** Move types to `src/features/tasks/types/`.

#### Issue #3: Missing Backend Endpoints
**Status:** Medium Priority
**Description:** Some frontend API calls don't have backend implementations.

| Module | Missing Endpoint |
|--------|------------------|
| Household | `GET /household/invitations` |
| Household | `DELETE /household/invitations/:id` |
| Household | `POST /household/invitations/:id/resend` |
| Inventory | `PATCH /inventory/categories/:id` |
| Inventory | `POST /inventory/items/:id/stock` |
| Employees | `POST /employees/:id/payments` |
| Employees | `GET /employees/:id/payments` |
| Employees | `POST /employees/:id/vacations` |
| Employees | `GET /employees/:id/vacations` |

**Impact:** These features show errors if accessed.
**Workaround:** Avoid using these specific features until implemented.

### Recently Fixed Issues

#### Fixed: ImpersonationLog Missing Relations
**Date Fixed:** February 2, 2026
**Description:** Prisma schema had ImpersonationLog without User relations.
**Fix Applied:** Added proper relations:
```prisma
model ImpersonationLog {
  superAdmin User @relation("ImpersonationBySuperAdmin", ...)
  targetUser User @relation("ImpersonatedUser", ...)
}
```

#### Fixed: UserManagement Missing Actions
**Date Fixed:** February 2, 2026
**Description:** User management component lacked password reset and impersonation.
**Fix Applied:** Added `onResetPassword` and `onImpersonate` props and handlers.

### Bug Reporting

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/error messages
5. Browser and OS information
6. User role when issue occurred

---

## Troubleshooting Guide

### Authentication Issues

#### "Invalid credentials"
- Verify email is correct
- Check CAPS LOCK
- Try password reset

#### "Account locked"
- Too many failed login attempts
- Contact household admin or wait for auto-unlock
- Super Admin can manually unlock

#### Token refresh failing
- Clear browser storage
- Log out and log in again
- Check if refresh token expired (7 days)

### Permission Issues

#### "You don't have permission"
- Check your assigned role
- Feature may be role-restricted
- Contact household admin for role change

#### Household suspended message
- Contact Super Admin
- Account is in read-only mode
- Cannot create/update/delete until unsuspended

### Data Issues

#### Data not appearing
1. Check internet connection
2. Refresh the page
3. Clear browser cache
4. Check browser console for errors

#### Data not saving
1. Check for validation errors
2. Ensure all required fields filled
3. Check network tab for API errors
4. Try smaller data (file size limits)

### Performance Issues

#### Slow loading
1. Check internet connection speed
2. Clear browser cache
3. Disable browser extensions
4. Try different browser

#### API timeouts
- Backend may be restarting
- Check server status
- Try again in a few minutes

### Backend Issues (Self-Hosted)

#### Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in .env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

#### Prisma migration errors
```bash
# Reset database (CAUTION: deletes data)
npx prisma migrate reset

# Apply pending migrations
npx prisma migrate deploy
```

#### Redis connection failed
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

---

## Maintenance Tasks

### Regular Maintenance

#### Weekly
- Review audit logs for unusual activity
- Check for suspended/locked accounts
- Review new user registrations

#### Monthly
- Analyze usage statistics
- Review and clean old audit logs
- Check for outdated data (expired items, etc.)
- Backup database

#### Quarterly
- Security audit
- Performance review
- Update dependencies
- Review user feedback

### Database Maintenance

#### Backup Database
```bash
# PostgreSQL backup
pg_dump household_db > backup_$(date +%Y%m%d).sql
```

#### Restore Database
```bash
# PostgreSQL restore
psql household_db < backup_20260202.sql
```

#### Clean Old Data
```sql
-- Delete audit logs older than 1 year
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';

-- Delete expired refresh tokens
DELETE FROM refresh_tokens WHERE expires_at < NOW();

-- Delete ended impersonation logs older than 90 days
DELETE FROM impersonation_logs
WHERE ended_at IS NOT NULL
AND ended_at < NOW() - INTERVAL '90 days';
```

### Application Updates

#### Frontend Update
```bash
cd /path/to/HouseHoldAPPP_V2
git pull origin main
npm install
npm run build
```

#### Backend Update
```bash
cd /path/to/HouseHoldAPPP_V2/apps/api
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart household-api
```

---

## Security Best Practices

### For Household Admins

1. **Password Security**
   - Use strong passwords (12+ characters)
   - Enable two-factor authentication
   - Change default passwords immediately

2. **Member Management**
   - Assign minimum necessary roles
   - Remove inactive members promptly
   - Review member list regularly

3. **Audit Logs**
   - Check logs weekly for suspicious activity
   - Investigate unexpected admin actions
   - Report security concerns

### For Super Admins

1. **Access Control**
   - Limit Super Admin accounts (2-3 max)
   - Use separate accounts for daily work
   - Never share Super Admin credentials

2. **Impersonation**
   - Only use for legitimate support
   - Document reason for each session
   - Review impersonation history regularly

3. **System Security**
   - Keep application updated
   - Monitor failed login attempts
   - Review suspended household reasons

4. **Data Protection**
   - Regular backups
   - Encrypt backups
   - Test restore procedures
   - Secure backup storage

### Incident Response

If you suspect a security breach:

1. **Immediate Actions**
   - Lock affected accounts
   - Suspend affected households
   - Preserve audit logs

2. **Investigation**
   - Review audit logs
   - Check impersonation history
   - Identify affected data

3. **Response**
   - Reset passwords for affected accounts
   - Notify affected users
   - Document incident

4. **Prevention**
   - Identify root cause
   - Implement fixes
   - Update security procedures

---

## Support Contacts

| Issue Type | Contact |
|------------|---------|
| Technical Issues | support@householdhero.com |
| Security Concerns | security@householdhero.com |
| Billing Questions | billing@householdhero.com |
| Feature Requests | feedback@householdhero.com |

---

*For user-level documentation, see [USER_MANUAL.md](./USER_MANUAL.md)*
*For API documentation, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)*
*For technical audit details, see [TECHNICAL_AUDIT_REPORT.md](./TECHNICAL_AUDIT_REPORT.md)*
