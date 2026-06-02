import { selectCurrentToken, selectCurrentUser } from '@/redux/slices/authSlice';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

interface HiddenMarketRouteProps {
  children: ReactNode;
}

export function HiddenMarketRoute({ children }: HiddenMarketRouteProps) {
  const location = useLocation();
  const user = useSelector(selectCurrentUser)

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

