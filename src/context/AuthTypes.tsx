import { createContext } from 'react';

export type UserRole = "Admin" | "Manager" | "Developer" | "Viewer" | "Project Manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  companyId?: string; // Added for compatibility with API endpoints
}

export interface LoginFormValues {
  email: string;
  password: string;
  companyId?: string; // Added for compatibility with API endpoints
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationId?: string;
  organizationName?: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: SignupFormValues) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);