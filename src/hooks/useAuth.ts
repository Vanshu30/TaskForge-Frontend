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

  const login = async ({ email, password }: LoginFormValues) => {
    try {
      const res = await apiLogin({ email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log('Login successful:', user);

      if (user.companyId) {
        navigate("/dashboard");
      } else {
        navigate("/create-company");
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const signup = async (data: SignupFormValues) => {
    try {
      const res = await apiSignup(data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log('Signup successful:', user);

      if (user.companyId) {
        navigate("/dashboard");
      } else {
        navigate("/create-company");
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
      throw error;
    }
  };

  return {
    ...context,
    isAuthenticated,
    login,
    signup
  };
};
