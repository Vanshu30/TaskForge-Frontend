import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthExports';

// Define the LoginFormValues interface if it's not imported from elsewhere
interface LoginFormValues {
  email: string;
  password: string;
  // Add any other fields that might be in your login form
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useLogin = () => {
  const navigate = useNavigate();
  
  const login = async (credentials: LoginFormValues) => {
    const response = await axios.post("/api/auth/login", credentials);
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Here check company
    if (user.companyId) {
      navigate("/dashboard");
    } else {
      navigate("/create-company");
    }
  };
  
  return { login };
};
