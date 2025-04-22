import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'Admin' | 'Manager' | 'Developer' | 'Viewer' | 'Project Manager';

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
    organizationId?: string;
    organizationName?: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => void;
  generateOrganizationId: () => string;
  listOrganizations: () => Organization[];
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

  const generateOrganizationId = () => {
    const prefix = 'org';
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 6);
    const orgId = `${prefix}-${timestamp}-${randomStr}`;
    return orgId;
  };

  const listOrganizations = () => {
    const storedOrgs = localStorage.getItem('organizations');
    const orgs = storedOrgs ? JSON.parse(storedOrgs) : {};
    return Object.entries(orgs).map(([id, org]: [string, any]) => ({
      id,
      name: org.name
    }));
  };

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
      throw err; // Re-throw the error to be caught by the Login component
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    organizationId?: string;
    organizationName?: string;
    role: UserRole;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email is already registered
      if (users.some((u: any) => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      let orgId = userData.organizationId;
      let orgName = userData.organizationName;

      // If no organization ID is provided, this is a new organization
      if (!orgId) {
        if (!orgName) {
          throw new Error('Organization name is required for new organizations');
        }
        orgId = generateOrganizationId();
      } else {
        // Verify that the organization exists
        const organizations = listOrganizations();
        const existingOrg = organizations.find(org => org.id === orgId);
        if (!existingOrg) {
          throw new Error('Organization ID not found');
        }
        orgName = existingOrg.name;
      }
      
      // Create user with ID and organization info
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        organizationId: orgId,
        organizationName: orgName,
      };
      
      // If this is a new organization, register it
      if (!userData.organizationId) {
        organizations[orgId] = {
          name: orgName
        };
        localStorage.setItem('organizations', JSON.stringify(organizations));
      }
      
      // Save user
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remove password before storing in state
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        generateOrganizationId,
        listOrganizations,
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
