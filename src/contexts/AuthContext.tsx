
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { login as apiLogin, logout as apiLogout, verifyToken } from '@/api/authApi';

interface User {
  id: number;
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const { valid, user } = await verifyToken();
          
          if (valid && user) {
            setUser(user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Failed to verify auth token', error);
          localStorage.removeItem('authToken');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiLogin({ username, password });
      
      if (response.user && response.token) {
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        toast.success(`Welcome, ${response.user.name}!`);
        return true;
      } else {
        toast.error('Invalid login response');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      navigate('/login');
      toast.info('You have been logged out');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-muted-foreground">Loading authentication...</p>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
