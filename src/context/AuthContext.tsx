import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export type User = {
  id: number;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  userRole?: string;
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthday?: string;
  verified?: boolean;
  [key: string]: any;
};

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean; 
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Iniciar en loading

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };


  React.useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      
      if (storedToken) {
        setToken(storedToken);
        
        if (!storedRole) {
          try {
            const { userService } = await import('../services/userService');
            const userData = await userService.getMe(storedToken);
            setUser(userData);
            if (userData.role) {
              localStorage.setItem('role', userData.role);
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            logout();
          }
        }
        else if (storedRole) {
          setUser({ 
            id: 0, 
            fullName: '', 
            email: '', 
            role: storedRole as 'USER' | 'ADMIN' 
          });
        }
      }
      
      setIsLoading(false); 
    };

    initializeAuth();
  }, []);

  React.useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    
    if (user && user.role) {
      localStorage.setItem('role', user.role);
    }
    
    localStorage.removeItem('user');
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ token, user, isLoading, setToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};