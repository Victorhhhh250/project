import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { ROUTES } from '@/constants/routes';

import Auth from '@/features/auth/pages/Auth';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import Alunos from '@/features/alunos/pages/Alunos';
import Agenda from '@/features/agenda/pages/Agenda';
import Financeiro from '@/features/financeiro/pages/Financeiro';
import Relatorios from '@/features/Relatorio/pages/Relatorios';
import Dietas from '@/features/dietas/pages/Dietas';
import Perfil from '@/features/perfil/pages/Perfi';
import Configuracoes from '@/features/configuracoes/pages/configuracoes';

export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: <Auth />,
  },
  {
    path: ROUTES.resetPassword,
    element: <ResetPassword />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.dashboard,    element: <Dashboard /> },
          { path: ROUTES.alunos,       element: <Alunos /> },
          { path: ROUTES.agenda,       element: <Agenda /> },
          { path: ROUTES.financeiro,   element: <Financeiro /> },
          { path: ROUTES.relatorios,   element: <Relatorios /> },
          { path: ROUTES.dietas,       element: <Dietas /> },
          { path: ROUTES.perfil,       element: <Perfil /> },
          { path: ROUTES.configuracoes, element: <Configuracoes /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.root} replace />,
  },
]);
