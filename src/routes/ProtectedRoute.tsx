import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-10">Verificando permisos...</div>;
  }
  const isAdmin = token && (user?.userRole === 'ADMIN' || user?.role === 'ADMIN');

  if (isAdmin) {
    return <>{children}</>;
  }
  
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;