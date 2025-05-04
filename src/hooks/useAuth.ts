// src/hooks/useAuth.ts
import { LoginFormValues, SignupFormValues } from '@/context/AuthTypes';
import { login as apiLogin, signup as apiSignup } from '@/service/authService';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthExports';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const isAuthenticated = !!localStorage.getItem('token');

  const login = async (data: LoginFormValues) => {
    try {
      console.log('Login attempt with:', data);
      const res = await apiLogin(data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log('Login successful:', user);

      // Navigate based on user data
      if (user.organizationId) {
        navigate("/dashboard");
      } else {
        navigate("/create-company");
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (data: SignupFormValues) => {
    try {
      console.log('Signup attempt with:', data);
      // Transform the data to match what the API expects
      const apiData = {
        ...data,
        data: {
          email: data.email,
          password: data.password
        }
      };
      const res = await apiSignup(apiData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log('Signup successful:', user);

      // Navigate based on user data
      if (user.organizationId) {
        navigate("/dashboard");
      } else {
        navigate("/create-company");
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return {
    ...context,
    isAuthenticated,
    login,
    signup,
    logout
  };
};
