import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
