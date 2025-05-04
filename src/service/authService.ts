import { LoginFormValues, SignupFormValues } from "@/context/AuthTypes";
import axios from "../api/axios"; // assuming axios base is configured

// Mock API responses for development
const mockLoginResponse = (data: LoginFormValues) => {
  return {
    data: {
      token: "mock-token-12345",
      user: {
        id: "user-123",
        name: "Test User",
        email: data.email,
        role: "Developer",
        organizationId: "org-123",
        organizationName: "Test Organization"
      }
    }
  };
};

const mockSignupResponse = (data: any) => {
  // Handle both old and new SignupFormValues structure
  const email = data.data?.email || data.email;
  
  return {
    data: {
      token: "mock-token-12345",
      user: {
        id: "user-" + Math.floor(Math.random() * 1000),
        name: data.name,
        email: email,
        role: data.role,
        organizationId: data.organizationId || "org-" + Math.floor(Math.random() * 1000),
        organizationName: data.organizationName || "New Organization"
      }
    }
  };
};

export const login = async (data: LoginFormValues) => {
  console.log("Login attempt with:", data);
  
  try {
    // For development, use mock response
    if (process.env.NODE_ENV === 'development' || !import.meta.env.VITE_API_URL) {
      console.log("Using mock login response");
      return mockLoginResponse(data);
    }
    
    // For production, use actual API
    return await axios.post('/auth/login', data);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signup = async (data: SignupFormValues) => {
  console.log("Signup attempt with:", data);
  
  try {
    // For development, use mock response
    if (process.env.NODE_ENV === 'development' || !import.meta.env.VITE_API_URL) {
      console.log("Using mock signup response");
      return mockSignupResponse(data);
    }
    
    // For production, use actual API
    return await axios.post('/auth/signup', data);
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

