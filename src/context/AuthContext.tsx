
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define the User type
export type UserRole = 'Admin' | 'Manager' | 'Developer' | 'Viewer' | 'Project Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  avatar?: string | null;
}

// Define Auth context value type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

// Create Auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  loading: true,
  isAuthenticated: false,
});

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Log debugging info
      console.info('All localStorage keys:', Object.keys(localStorage));
      console.info('Raw users from localStorage:', localStorage.getItem('users'));
      console.info('Logging in with:', email, password);

      // Get users from localStorage
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      console.info('Available users:', users);

      // Find user with matching email and password
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        });
        setLoading(false);
        return false;
      }

      // Create user object
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        organizationId: foundUser.organizationId,
        organizationName: foundUser.organizationName,
        avatar: foundUser.avatar || null,
      };

      // Store in localStorage and state
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      setLoading(false);
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (data: any): Promise<boolean> => {
    setLoading(true);
    try {
      // Log debugging info
      console.info('localStorage before signup:', Object.keys(localStorage));
      console.info('Raw users before signup:', localStorage.getItem('users'));

      // Get current users or initialize empty array
      const usersData = localStorage.getItem('users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if email already exists
      if (users.some((u: any) => u.email === data.email)) {
        toast({
          title: 'Registration failed',
          description: 'Email is already registered.',
          variant: 'destructive',
        });
        setLoading(false);
        return false;
      }

      // Create new user with ID
      const newUser = {
        ...data,
        id: Date.now().toString(),
      };
      
      console.info('User registered:', newUser);

      // Store new user
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      console.info('All users after registration:', updatedUsers);
      console.info('localStorage after signup:', Object.keys(localStorage));

      // Update organizations
      if (data.organizationName) {
        const organizationsData = localStorage.getItem('organizations');
        const organizations = organizationsData ? JSON.parse(organizationsData) : [];
        
        // Create new organization if creating one
        const orgId = data.organizationId || `org-${Math.random().toString(36).substr(2, 9)}`;
        
        if (!data.organizationId) {
          // Creating new org
          const newOrg = {
            id: orgId,
            name: data.organizationName,
            owner: data.email,
            members: [{ id: newUser.id, name: data.name, email: data.email, role: data.role }],
            createdAt: new Date().toISOString(),
          };
          
          localStorage.setItem('organizations', JSON.stringify([...organizations, newOrg]));
        } else {
          // Joining existing org
          const existingOrgIndex = organizations.findIndex((o: any) => o.id === data.organizationId);
          if (existingOrgIndex >= 0) {
            organizations[existingOrgIndex].members.push({
              id: newUser.id,
              name: data.name,
              email: data.email,
              role: data.role
            });
            localStorage.setItem('organizations', JSON.stringify(organizations));
          }
        }
      }

      // Create user object
      const userData: User = {
        id: newUser.id,
        name: data.name,
        email: data.email,
        role: data.role,
        organizationId: data.organizationId,
        organizationName: data.organizationName,
        avatar: null,
      };

      // Store in localStorage and state
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created.',
      });
      
      setLoading(false);
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Registration failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
