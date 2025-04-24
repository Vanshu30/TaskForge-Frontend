
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
      
      // Ensure demo user exists
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Create demo user if no users exist
      if (storedUsers.length === 0) {
        const demoUser = {
          id: 'user-demo-1',
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'password123',
          role: 'Admin' as UserRole,
          organizationId: 'org-1',
          organizationName: 'Demo Organization'
        };
        
        localStorage.setItem('users', JSON.stringify([demoUser]));
        console.log('Created demo user:', demoUser.email);
      }
      
      // Try login with updated users list
      const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const matchedUser = updatedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!matchedUser) {
        console.error("No matching user found:", email);
        throw new Error('Invalid credentials');
      }

      const userData = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        organizationId: matchedUser.organizationId,
        organizationName: matchedUser.organizationName,
      };

      console.log("User successfully logged in:", userData.email);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set some dummy package selection for demo purposes if not exists
      const hasSelectedPlan = localStorage.getItem('selectedPlan');
      if (!hasSelectedPlan) {
        localStorage.setItem('selectedPlan', 'pro');
      }
      
    } catch (error) {
      console.error("Login error:", error);
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
