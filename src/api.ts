const API_BASE_URL= import.meta.env.VITE_API_BASE_URL;

// Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

/**
 * Generic API request function for making HTTP requests
 * @param endpoint - The API endpoint to call
 * @param options - Request options including method, headers, and body
 * @returns Promise with the response data
 */
export async function apiRequest<T = Record<string, unknown>>(
  endpoint: string, 
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const { 
    method = 'GET', 
    headers = {}, 
    body 
  } = options;

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
}

// Import User type from AuthTypes
import { User } from './context/AuthTypes';

// Login response type
interface LoginResponse {
  user: User;
  token?: string;
}

// Login
export async function loginUser(credentials: { 
  email: string, 
  password: string,
  organizationId?: string,
  organizationName?: string,
  role?: string
}): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/login', {
    method: 'POST',
    body: credentials
  });
}

// Signup response type (similar to login)
interface SignupResponse {
  user: User;
  token?: string;
}

// Signup
export async function signupUser(details: {
  name: string,
  email: string,
  password: string,
  organizationId?: string,
  organizationName?: string,
  role: string
}): Promise<SignupResponse> {
  return apiRequest<SignupResponse>('/signup', {
    method: 'POST',
    body: details
  });
}

// Fetch Projects
export async function getProjects() {
  return apiRequest<Project[]>('/projects');
}

// Fetch Tasks
export async function getTasks() {
  return apiRequest('/tasks');
}
