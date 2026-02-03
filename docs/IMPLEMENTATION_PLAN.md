# Household Hero - Complete Implementation Plan

**Version:** 2.0.0
**Target:** Fresh start with NestJS + React + PostgreSQL
**Architecture:** Modular monolith with clean separation
**Purpose:** Autonomous development guide for Claude Code

---

## Project Overview

### Vision
Build a comprehensive household management application from scratch with professional architecture, featuring role-based access, dashboards, and modular design.

### Core Principles
1. **Modular Architecture** - Each feature is self-contained
2. **Type Safety** - TypeScript everywhere
3. **Security First** - Server-side validation, JWT auth, role-based access
4. **Dashboard-Driven** - Rich data visualization and insights
5. **Scalable** - Easy to add new modules and features

---

## Tech Stack

### Backend
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Cache:** Redis 7
- **Authentication:** JWT + Passport.js
- **Validation:** class-validator + class-transformer
- **Testing:** Jest

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** shadcn/ui (Radix UI + TailwindCSS)
- **State Management:**
  - TanStack Query (server state)
  - Zustand (client state)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Routing:** React Router v6
- **Testing:** Vitest + React Testing Library

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Database UI:** Prisma Studio
- **API Documentation:** Swagger/OpenAPI

---

## Project Structure

```
household-hero-v2/                    # NEW PROJECT DIRECTORY
├── apps/
│   ├── api/                         # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # Authentication & authorization
│   │   │   │   ├── users/          # User management
│   │   │   │   ├── admin/          # Admin dashboard & controls
│   │   │   │   ├── household/      # Household & member management
│   │   │   │   ├── employees/      # Employee management
│   │   │   │   ├── vehicles/       # Car/vehicle management
│   │   │   │   ├── pets/           # Pet management
│   │   │   │   ├── finance/        # Finance & budget module
│   │   │   │   ├── tasks/          # Task management
│   │   │   │   ├── inventory/      # Inventory with categories
│   │   │   │   ├── scanning/       # Receipt scanning & barcode
│   │   │   │   ├── calendar/       # Events & scheduling
│   │   │   │   ├── recipes/        # Recipe management
│   │   │   │   ├── dashboard/      # Dashboard data aggregation
│   │   │   │   └── notifications/  # Notification system
│   │   │   ├── common/             # Shared utilities
│   │   │   ├── config/             # Configuration
│   │   │   └── database/           # Database service
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── test/
│   │
│   └── web/                         # React Frontend
│       ├── src/
│       │   ├── features/
│       │   │   ├── auth/           # Login, registration
│       │   │   ├── admin/          # Admin dashboard & tools
│       │   │   ├── dashboard/      # Main dashboard
│       │   │   ├── household/      # Household management
│       │   │   ├── employees/      # Employee management
│       │   │   ├── vehicles/       # Vehicle management
│       │   │   ├── pets/           # Pet management
│       │   │   ├── finance/        # Finance & budgets
│       │   │   ├── tasks/          # Task management
│       │   │   ├── inventory/      # Inventory management
│       │   │   ├── scanning/       # Receipt scanning & barcode
│       │   │   ├── calendar/       # Calendar & events
│       │   │   └── recipes/        # Recipe management
│       │   ├── shared/             # Shared components
│       │   └── app/                # App setup
│       └── public/
│
├── docker/
│   ├── docker-compose.yml
│   └── init.sql
│
├── docs/
│   ├── IMPLEMENTATION_PLAN.md       # This file
│   ├── DEVELOPMENT_ROADMAP.md       # Phased roadmap
│   ├── MODULE_SPECIFICATIONS.md     # Module details
│   ├── DATABASE_SCHEMA_COMPLETE.md  # Full schema
│   ├── API_SPECIFICATIONS.md        # API endpoints
│   └── FRONTEND_SPECIFICATIONS.md   # UI/Dashboard specs
│
└── README.md
```

---

## Modules Overview

### 1. Authentication & Authorization
**Purpose:** Secure login, registration, role-based access control

**Features:**
- Email/password authentication
- JWT token management
- 2FA (TOTP)
- Password reset
- Role-based access (ADMIN, PARENT, MEMBER, STAFF)
- Session management

**Tech:**
- Passport.js + JWT strategy
- bcrypt for password hashing
- speakeasy for 2FA

---

### 2. Admin Module
**Purpose:** Administrative control panel for system management

**Status:** ✅ COMPLETE (February 2, 2026)

**Features:**
- Admin dashboard with system metrics
- User management (activate/deactivate, role assignment)
- Household management (view all, analytics)
- System settings
- Audit logs viewer
- Database statistics
- Activity monitoring

**Super Admin Features (NEW):**
- ✅ System-wide dashboard with platform metrics
- ✅ Household management (create, suspend, unsuspend)
- ✅ System-wide user search and management
- ✅ User impersonation for support purposes
- ✅ Password reset functionality
- ✅ Impersonation audit logging
- ✅ Suspension read-only mode with banners

**Access:** ADMIN role for household, SUPER_ADMIN for platform

---

### 3. Household & Members
**Purpose:** Manage household structure and family members

**Features:**
- Household creation and setup
- Member registration and profiles
- Member roles (Parent, Child, Guest)
- Family tree visualization
- Member permissions
- Household settings

**Database:**
- Households table
- Members table (linked to users)
- Member relationships

---

### 4. Employees Module
**Purpose:** Manage household staff and employees

**Features:**
- Employee registration and profiles
- Role/position management
- Work schedule
- Salary management
- Payment history
- Vacation/leave tracking
- Performance notes
- Document storage (contracts, certifications)

**Access:** PARENT/ADMIN only for sensitive data

---

### 5. Vehicles Module
**Purpose:** Manage family vehicles and maintenance

**Features:**
- Vehicle registry (make, model, year, VIN)
- Ownership tracking
- Maintenance schedule
- Service history
- Insurance tracking
- Fuel logging
- Expense tracking
- Document storage (registration, insurance)

**Dashboard Widgets:**
- Upcoming maintenance
- Insurance expiration alerts
- Fuel efficiency charts

---

### 6. Pets Module
**Purpose:** Pet care and health tracking

**Features:**
- Pet profiles (name, breed, age, photo)
- Vaccination records
- Vet appointments
- Medication schedule
- Weight tracking
- Medical history
- Feeding schedule
- Grooming appointments
- Pet expenses

**Dashboard Widgets:**
- Upcoming vet appointments
- Vaccination due dates
- Medication reminders

---

### 7. Finance Module
**Purpose:** Comprehensive budget and financial management

**Features:**
- Budget creation and tracking
- Income/expense categories
- Transaction logging
- Monthly/yearly budgets
- Bill management and reminders
- Recurring expenses
- Financial goals
- Reports and analytics
- Export to CSV/PDF
- Multi-currency support (optional)

**Dashboard Widgets:**
- Budget overview
- Income vs expenses
- Category breakdown charts
- Upcoming bills
- Financial health score

**Access:** PARENT/ADMIN only for full access

---

### 8. Tasks Module
**Purpose:** Task management and assignment

**Features:**
- Task creation with priorities
- Assignment to members
- Due dates and reminders
- Subtasks
- Task templates
- Categories/tags
- Comments and collaboration
- Recurring tasks
- Kanban board view
- Calendar view
- Task history

**Dashboard Widgets:**
- My tasks overview
- Overdue tasks
- Completed tasks chart
- Task distribution by member

---

### 9. Inventory Module
**Purpose:** Household inventory with categories and subcategories

**Features:**
- Item management
- **Category system:**
  - Main categories (Kitchen, Garage, Pantry, etc.)
  - Subcategories (Kitchen → Appliances → Small Appliances)
  - Unlimited nesting levels
- Quantity tracking
- Location tracking
- Purchase information
- Expiry dates
- Low stock alerts
- Shopping list generation
- Barcode scanning (future)
- Item photos

**Categories Example:**
```
Kitchen
├── Appliances
│   ├── Small Appliances
│   └── Large Appliances
├── Cookware
└── Utensils
Pantry
├── Dry Goods
├── Canned Foods
└── Spices
Garage
└── Tools
```

**Dashboard Widgets:**
- Low stock items
- Expiring items
- Inventory value
- Category distribution

---

### 10. Receipt Scanning & Barcode Module
**Purpose:** AI-powered receipt scanning and barcode management for easy inventory and budget tracking

**Features:**

**Receipt Scanning:**
- Camera capture or image upload for receipts
- OCR text extraction (hybrid approach):
  - **Free tier:** Tesseract.js (client-side, ~70-80% accuracy, offline)
  - **AI tier:** OpenAI Vision or Google Cloud Vision (optional, ~95% accuracy)
  - Auto-fallback if AI service fails
- Smart receipt parsing:
  - Extract store name, date, total, tax
  - Parse line items with quantities and prices
  - Auto-categorize items (Groceries, Household, etc.)
- Receipt review dialog:
  - Visual preview of scanned receipt
  - Editable parsed data with validation
  - Confidence scoring (highlight uncertain OCR results)
  - Item-to-inventory matching
- **Dual-action processing:**
  - Create financial transaction in Finance module
  - Auto-update inventory quantities
- Permission-based workflows:
  - **Staff:** Can scan receipts to update inventory only
  - **Parents/Admin:** Can create transactions + update inventory

**Barcode Scanning:**
- Real-time barcode detection (EAN-13, UPC-A, QR codes)
- Multiple scanning modes:
  - **Quick Lookup:** Scan to find/add inventory items
  - **Receipt Verification:** Scan receipt barcode for validation
  - **Shopping List Check:** Scan items while shopping to check them off
- Product lookup integration:
  - Open Food Facts API for product information
  - Local inventory search first
  - Fallback to manual entry
- Quick actions after scan:
  - Adjust quantity (+/- buttons)
  - Add to shopping list
  - View item details

**OCR Service Configuration:**
- Settings panel for OCR service selection
- API key management (encrypted, browser-stored)
- Service testing and validation
- Usage cost tracking
- Visual indicators showing which service was used

**Tech Stack:**
- **OCR:** Tesseract.js (default), OpenAI Vision API (optional), Google Cloud Vision (optional)
- **Barcode:** @zxing/browser and @zxing/library
- **Camera:** react-webcam for simplified camera access
- **Validation:** Zod schemas for receipt data
- **Storage:** localStorage for OCR service config

**Database Integration:**
- `Transaction.receiptUrl` - stores receipt image data
- `Transaction.receiptItems[]` - array of parsed receipt items
- `InventoryItem.barcode` - barcode field for products
- `InventoryItem.photos[]` - product images

**Dashboard Widgets:**
- Recent receipts processed
- OCR service status and usage
- Receipt processing statistics
- Cost savings from hybrid OCR approach

**Access Permissions:**
| Feature | STAFF | MEMBER | PARENT | ADMIN |
|---------|-------|--------|--------|-------|
| Scan Receipt → View | ✅ | ❌ | ✅ | ✅ |
| Scan Receipt → Update Inventory | ✅ | ❌ | ✅ | ✅ |
| Scan Receipt → Create Transaction | ❌ | ❌ | ✅ | ✅ |
| Barcode Lookup | ✅ | ✅ | ✅ | ✅ |
| Shopping List Verify | ✅ | ✅ | ✅ | ✅ |
| OCR Service Config | ❌ | ❌ | ✅ | ✅ |

**Implementation Notes:**
- Start with free Tesseract.js (zero barrier to entry)
- Add AI service support as optional upgrade
- Automatic fallback ensures reliability
- Mobile-first design (camera access critical)
- Offline-capable with free tier
- Graceful degradation when camera unavailable

**Future Enhancements:**
- Multi-receipt batch processing
- Receipt templates for common stores
- Warranty tracking from receipts
- Receipt history and archive
- Export receipts to PDF/CSV
- Receipt sharing between household members
- Machine learning for improved parsing
- Confidence-based auto-approval (skip review for high confidence)

---

### 11. Calendar Module
**Purpose:** Unified calendar for all household events

**Features:**
- Event creation and management
- Event categories (birthday, appointment, meeting, etc.)
- All-day and timed events
- Recurring events
- Color coding by category
- Member-specific calendars
- Reminders/notifications
- Google Calendar sync (optional)

**Dashboard Widgets:**
- Upcoming events
- Today's schedule
- Birthday reminders

---

### 12. Recipes Module
**Purpose:** Recipe collection and meal planning

**Features:**
- Recipe creation and storage
- Ingredients list
- Step-by-step instructions
- Cooking time and servings
- Categories/tags
- Recipe photos
- Meal planning
- Shopping list integration with inventory
- Nutrition information (optional)

**Dashboard Widgets:**
- Recipe of the day
- Planned meals

---

### 13. Dashboard Module
**Purpose:** Centralized data aggregation and visualization

**Features:**
- **Main Dashboard (All Users):**
  - Personalized welcome
  - Quick stats overview
  - Recent activity
  - Upcoming tasks
  - Today's events
  - Quick actions

- **Admin Dashboard:**
  - System health
  - User statistics
  - Household statistics
  - Module usage analytics
  - Recent activity logs

- **Finance Dashboard:**
  - Budget overview
  - Income/expense charts
  - Bill reminders
  - Financial trends

- **Inventory Dashboard:**
  - Stock levels
  - Expiring items
  - Category distribution

**Tech:**
- Recharts for data visualization
- Real-time updates via WebSocket (optional)

---

### 14. Notifications Module
**Purpose:** System-wide notification handling

**Features:**
- In-app notifications
- Email notifications (optional)
- Push notifications (future)
- Notification preferences
- Mark as read/unread
- Notification history

**Triggers:**
- Task assignments
- Due date reminders
- Bill reminders
- Low stock alerts
- Event reminders
- System announcements

---

## User Roles & Permissions

### SUPER_ADMIN (NEW - Platform Level)
- Full platform access
- Manage all households
- System-wide user management
- User impersonation for support
- Household suspension/activation
- Platform metrics and analytics
- System configuration

### ADMIN (Household Level)
- Full household access
- User management within household
- Household configuration
- All module access
- Audit log access

### PARENT
- Household management
- Member management
- Finance module (full access)
- Employee management
- All household data access
- Module configuration

### MEMBER
- Personal tasks
- Personal calendar
- View-only for most modules
- Limited finance access
- Own profile management

### STAFF
- Assigned tasks
- Limited household access
- Work schedule access
- Own profile management

---

## Development Phases

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE
- ✅ Project setup
- ✅ Docker configuration
- ✅ Database schema
- ✅ Authentication module
- ✅ User module
- ✅ Basic admin panel

### Phase 2: Core Modules (Week 3-6) ✅ COMPLETE
- ✅ Household & members
- ✅ Tasks module
- ✅ Calendar module
- ✅ Dashboard foundation

### Phase 3: Extended Modules (Week 7-10) ✅ COMPLETE
- ✅ Employees module
- ✅ Vehicles module
- ✅ Pets module
- ✅ Inventory module with categories
- ✅ Receipt scanning & barcode module (Phase 1: Tesseract.js)
- ✅ Kids module

### Phase 4: Finance & Analytics (Week 11-12) ✅ COMPLETE
- ✅ Finance module
- ✅ Budget tracking
- ✅ Reports and charts
- ✅ Dashboard enhancements

### Phase 5: Polish & Testing (Week 13-14) ✅ COMPLETE
- ✅ Recipes module
- ✅ Notifications module
- ⏳ Receipt scanning AI services (OpenAI Vision, Google Cloud Vision - optional)
- ✅ UI/UX improvements
- ✅ Testing and bug fixes
- ✅ Documentation

### Phase 6: Admin System Enhancement (Week 15-16) ✅ COMPLETE
- ✅ Super Admin role implementation
- ✅ System-wide dashboard
- ✅ Household management (suspend/unsuspend)
- ✅ User impersonation for support
- ✅ Password reset functionality
- ✅ Impersonation audit logging
- ✅ Read-only suspension mode

### Phase 7: Launch Preparation (Current)
- ✅ Technical audit completed
- ✅ Documentation updated
- ✅ Mock API implementation for frontend-only development
- ⏳ Performance optimization
- ⏳ Security hardening
- ⏳ Deployment setup

---

## Frontend Mock API Implementation

For frontend-only development and testing without a backend server, the application includes comprehensive mock data support.

### Mock API Pattern
All API files follow this pattern:
```typescript
const USE_MOCK_API = true;
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const someApi = {
  getData: async () => {
    if (USE_MOCK_API) {
      await mockDelay();
      return mockData;
    }
    return apiClient.get('/endpoint');
  },
};
```

### Mock Data Status (as of February 3, 2026)

| API File | Mock Data | Status |
|----------|-----------|--------|
| `auth.api.ts` | ✅ Complete | Test users with login |
| `admin.api.ts` | ✅ Complete | Households, users, audit logs, impersonation |
| `dashboard.api.ts` | ✅ Complete | Stats, activity, tasks, events |
| `household.api.ts` | ⏳ Pending | Needs mock data |
| `finance.api.ts` | ⏳ Pending | Needs mock data |
| `tasks.api.ts` | ⏳ Pending | Needs mock data |
| `inventory.api.ts` | ⏳ Pending | Needs mock data |
| `calendar.api.ts` | ⏳ Pending | Needs mock data |
| `vehicles.api.ts` | ⏳ Pending | Needs mock data |
| `pets.api.ts` | ⏳ Pending | Needs mock data |
| `employees.api.ts` | ⏳ Pending | Needs mock data |
| `recipes.api.ts` | ⏳ Pending | Needs mock data |
| `kids.api.ts` | ⏳ Pending | Needs mock data |
| `notifications.api.ts` | ⏳ Pending | Needs mock data |

### Test Credentials
| Email | Password | Role |
|-------|----------|------|
| `superadmin@example.com` | `password123` | SUPER_ADMIN |
| `admin@example.com` | `password123` | ADMIN |
| `parent@example.com` | `password123` | PARENT |
| `member@example.com` | `password123` | MEMBER |

### Switching to Real API
To use the real backend API:
1. Set `USE_MOCK_API = false` in each API file
2. Or set environment variable `VITE_USE_MOCK_AUTH=false`
3. Ensure backend server is running at configured API URL

---

## Database Design Principles

### Core Tables
1. Users and authentication
2. Households and members
3. Roles and permissions
4. Module-specific tables

### Relationships
- Households have many members
- Members belong to households
- Tasks belong to households
- All data scoped to households
- Admin sees all, others see own household only

### Indexes
- Household ID on all tables
- User ID for assignments
- Date fields for filtering
- Category fields for grouping

---

## API Design Principles

### RESTful Structure
```
/api/v1/auth/*
/api/v1/admin/*
/api/v1/household/*
/api/v1/employees/*
/api/v1/vehicles/*
/api/v1/pets/*
/api/v1/finance/*
/api/v1/tasks/*
/api/v1/inventory/*
/api/v1/scanning/*               # Receipt scanning & barcode
/api/v1/calendar/*
/api/v1/recipes/*
/api/v1/dashboard/*
```

### Standard Responses
```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Authentication
- JWT Bearer tokens
- Refresh token mechanism
- Role-based guards
- Household-scoped queries

---

## Frontend Design Principles

### Layout Structure
```
App
├── Auth Layout (Login/Register)
└── Main Layout
    ├── Sidebar Navigation
    ├── Top Bar (User menu, notifications)
    └── Content Area
        ├── Dashboard
        └── Module Pages
```

### Dashboard Design
- Card-based layout
- Responsive grid
- Data visualization with charts
- Quick action buttons
- Real-time updates
- Customizable widgets (future)

### Component Library
- shadcn/ui for all UI components
- Custom dashboard components
- Shared layouts
- Consistent styling with TailwindCSS

---

## Security Requirements

### Authentication
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ JWT with short expiration (15min)
- ✅ Refresh tokens (7 days)
- ✅ 2FA support
- ✅ Account lockout after failed attempts

### Authorization
- ✅ Role-based access control
- ✅ Household data isolation
- ✅ Route guards on frontend
- ✅ Guards on backend endpoints
- ✅ Admin-only routes

### Data Protection
- ✅ Server-side validation
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Input sanitization

### Audit
- ✅ Audit logs for sensitive operations
- ✅ Login history
- ✅ Data change tracking

---

## Testing Strategy

### Backend
- Unit tests for services
- Integration tests for APIs
- E2E tests for critical flows
- Coverage target: 80%

### Frontend
- Component tests
- Integration tests
- E2E tests with Playwright
- Coverage target: 70%

---

## Performance Targets

### Backend
- API response time: < 200ms (avg)
- Database queries: < 50ms (avg)
- Support 1000+ concurrent users

### Frontend
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse score: > 90

---

## Deployment Strategy

### Development
- Local Docker containers
- Hot reload for both apps
- Prisma Studio for database

### Staging (Future)
- Docker containers
- Managed PostgreSQL
- Redis cache
- CI/CD pipeline

### Production (Future)
- Container orchestration
- Load balancing
- Database backups
- Monitoring and logging

---

## Success Criteria

### Phase Completion
- ✅ All features working as specified
- ✅ Tests passing (>80% coverage)
- ✅ No critical bugs
- ✅ Documentation complete
- ✅ Code review passed

### Module Completion
- ✅ CRUD operations working
- ✅ Permissions enforced
- ✅ Dashboard widgets functional
- ✅ Tests written and passing
- ✅ API documented

---

## Next Steps for Claude Code

When you start in the NEW project directory, follow this sequence:

1. **Read all documentation files** in order:
   - IMPLEMENTATION_PLAN.md (this file)
   - DEVELOPMENT_ROADMAP.md
   - MODULE_SPECIFICATIONS.md
   - DATABASE_SCHEMA_COMPLETE.md
   - API_SPECIFICATIONS.md
   - FRONTEND_SPECIFICATIONS.md

2. **Initialize project:**
   - Create directory structure
   - Set up Docker
   - Initialize NestJS backend
   - Initialize React frontend
   - Set up Prisma with schema

3. **Follow roadmap phases:**
   - Complete Phase 1 (Foundation)
   - Complete Phase 2 (Core modules)
   - Continue through all phases

4. **For each module:**
   - Create database models
   - Generate Prisma migration
   - Build backend API
   - Create frontend UI
   - Add to dashboard
   - Write tests
   - Update documentation

5. **Commit frequently:**
   - After each module completion
   - After each feature completion
   - With descriptive commit messages

---

## Documentation Files

All detailed specifications are in separate files:

- **DEVELOPMENT_ROADMAP.md** - Week-by-week implementation plan
- **MODULE_SPECIFICATIONS.md** - Detailed module specs with user stories
- **DATABASE_SCHEMA_COMPLETE.md** - Complete Prisma schema
- **API_SPECIFICATIONS.md** - All API endpoints with request/response examples
- **FRONTEND_SPECIFICATIONS.md** - Dashboard layouts, components, and pages

---

## Contact & Support

**For the autonomous Claude Code agent:**
- Follow specifications exactly
- Ask clarifying questions if specifications are ambiguous
- Prioritize security and data integrity
- Write tests for all features
- Document as you go

**Good luck building! 🚀**
