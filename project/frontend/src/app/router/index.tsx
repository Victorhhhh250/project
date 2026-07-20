import { createBrowserRouter, Navigate } from 'react-router-dom';

import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { ROUTES } from '@/constants/routes';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { LoginPage } from '@/features/dashboard/pages/LoginPage';
import { ProtectedRoute } from './protected';

export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.root} replace />,
  },
]);
