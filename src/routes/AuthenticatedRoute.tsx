import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { user, token, setUser, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = React.useState(false);

  React.useEffect(() => {
    if (token && !isLoading && (!user || !user.fullName)) {
      setLocalLoading(true);
      import('../services/userService').then(({ userService }) => {
        userService.getMe(token).then((data) => {
          setUser(data);
          setLocalLoading(false);
        }).catch(() => {
          setLocalLoading(false);
        });
      });
    }
  }, [token, user, setUser, isLoading]);

  if (!token && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || localLoading || (token && !user)) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;