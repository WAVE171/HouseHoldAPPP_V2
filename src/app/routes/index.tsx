import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import { AuthLayout, MainLayout } from '@/shared/components/layouts';

// Auth
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, ProtectedRoute } from '@/features/auth';

// Dashboard
import { DashboardPage } from '@/features/dashboard';

// Household
import { HouseholdPage } from '@/features/household';

// Tasks
import { TasksPage } from '@/features/tasks';

// Calendar
import { CalendarPage } from '@/features/calendar';

// Inventory
import { InventoryPage } from '@/features/inventory';

// Finance
import { FinancePage } from '@/features/finance';

// Vehicles
import { VehiclesPage } from '@/features/vehicles';

// Employees
import { EmployeesPage } from '@/features/employees';

// Recipes
import { RecipesPage } from '@/features/recipes';

// Admin
import { AdminPage } from '@/features/admin';

// Settings
import { SettingsPage } from '@/features/settings';

// Profile
import { ProfilePage } from '@/features/profile';

// Pets
import { PetsPage } from '@/features/pets';

// Kids
import { KidsPage } from '@/features/kids';

// Scanning - Lazy loaded due to heavy dependencies (@zxing/library, tesseract.js)
const ScanningPage = lazy(() => import('@/features/scanning/pages/ScanningPage').then(module => ({ default: module.ScanningPage })));

// Placeholder pages for other modules
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">
          This module is coming soon.
        </p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Public routes (Auth)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },

  // Protected routes (Main app)
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/household',
        element: <HouseholdPage />,
      },
      {
        path: '/employees',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT', 'SUPER_ADMIN']}>
            <EmployeesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vehicles',
        element: <VehiclesPage />,
      },
      {
        path: '/pets',
        element: <PetsPage />,
      },
      {
        path: '/tasks',
        element: <TasksPage />,
      },
      {
        path: '/inventory',
        element: <InventoryPage />,
      },
      {
        path: '/finance',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT', 'SUPER_ADMIN']}>
            <FinancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/calendar',
        element: <CalendarPage />,
      },
      {
        path: '/recipes',
        element: <RecipesPage />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/kids',
        element: <KidsPage />,
      },
      {
        path: '/scanning',
        element: (
          <ProtectedRoute roles={['ADMIN', 'PARENT', 'STAFF', 'SUPER_ADMIN']}>
            <Suspense fallback={
              <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading scanner...</p>
                </div>
              </div>
            }>
              <ScanningPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Root redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // Catch-all 404
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground mt-2">Page not found</p>
        </div>
      </div>
    ),
  },
]);
