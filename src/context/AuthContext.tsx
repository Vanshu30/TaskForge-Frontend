import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = "Admin" | "Manager" | "Developer" | "Viewer" | "Project Manager";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes, create a test user if no users exist
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (storedUsers.length === 0) {
        // Create demo user
        const demoUser = {
          id: 'user-demo-1',
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'password123',
          role: 'Admin' as UserRole,
          organizationName: 'Demo Organization'
        };
        
        localStorage.setItem('users', JSON.stringify([demoUser]));
        console.log('Created demo user:', demoUser.email);
      }
      
      // Try login with updated users list
      const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = updatedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organizationName,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      const hasSelectedPlan = localStorage.getItem('selectedPlan');
      navigate(hasSelectedPlan ? '/dashboard' : '/package-selection');
      
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedPlan');
    navigate('/login');
  };

  const signup = async (userData: any) => {
    try {
      setLoading(true);
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (storedUsers.some((u: any) => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
      };

      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));

      await login(userData.email, userData.password);
      navigate('/package-selection');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      logout, 
      signup 
    }}>
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
