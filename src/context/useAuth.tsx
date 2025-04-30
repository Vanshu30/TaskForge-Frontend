import { AuthContext } from '@/context/AuthContext';
import { LoginFormValues, SignupFormValues } from '@/context/AuthTypes';
import { login as loginApi, signup as signupApi } from '@/service/authService';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // 👈 import toast

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (data: LoginFormValues) => {
    try {
      const response = await loginApi(data);
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);

      toast.success('Login successful! 🎉'); // ✅ show success popup
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const signup = async (data: SignupFormValues) => {
    try {
      const response = await signupApi(data);
      console.log('Signup response:', response.data);

      toast.success('Signup successful! 🚀 Please login now.');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error?.response?.data?.message || 'Signup failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast.info('Logged out successfully.');
  };

  // Combine the context with our local functions
  return {
    ...context,
    isAuthenticated,
    login,
    signup,
    logout,
  };
};
