
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'Admin' | 'Manager' | 'Developer' | 'Viewer';

export interface Organization {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    organizationId: string;
    organizationName: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => void;
  checkOrganizationId: (orgId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database for organizations - in a real app this would be in a database
const organizations: Record<string, { name: string }> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // This is just a mock implementation
      // In a real app, this would be an API call to your authentication service
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password before storing user in state
      const { password: _, ...userWithoutPassword } = foundUser;
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast({
        title: 'Welcome back!',
        description: `You're logged in as ${userWithoutPassword.name}`,
      });
      
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    organizationId: string;
    organizationName: string;
    role: UserRole;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if organization exists
      const isOrgIdTaken = await checkOrganizationId(userData.organizationId);
      if (isOrgIdTaken) {
        throw new Error('Organization ID already in use');
      }
      
      // This is just a mock implementation
      // In a real app, this would be an API call to your authentication service
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email is already registered
      if (users.some((u: any) => u.email === userData.email)) {
        throw new Error('Email already registered');
      }
      
      // Create user with ID
      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };
      
      // Register organization
      organizations[userData.organizationId] = {
        name: userData.organizationName
      };
      
      // Save organizations to localStorage for persistence
      localStorage.setItem('organizations', JSON.stringify(organizations));
      
      // Save user to "database"
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remove password before storing user in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast({
        title: 'Account created!',
        description: `Welcome to TaskFlow, ${userWithoutPassword.name}!`,
      });
      
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  const checkOrganizationId = async (orgId: string): Promise<boolean> => {
    // Load organizations from localStorage
    const storedOrgs = localStorage.getItem('organizations');
    const orgs = storedOrgs ? JSON.parse(storedOrgs) : {};
    
    // Check if organization ID already exists
    return !!orgs[orgId];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        checkOrganizationId,
      }}
    >
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
