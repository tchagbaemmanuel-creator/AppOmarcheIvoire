import { selectCurrentToken, selectCurrentUser } from '@/redux/slices/authSlice';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  restrictedForAreaAdmin?: boolean;
}

export function ProtectedRoute({ children, restrictedForAreaAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Restrict access to certain routes for admins with areaCode
  if (restrictedForAreaAdmin && user.areaCode) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
