// src/hooks/useAuth.ts
import { login as apiLogin, signup as apiSignup } from '@/service/authService';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthExports';

interface LoginFormValues {
  email: string;
  password: string;
}

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const isAuthenticated = !!localStorage.getItem('token');

  const login = async ({ email, password }: LoginFormValues) => {
    const res = await apiLogin({ email, password });
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.companyId) {
      navigate("/dashboard");
    } else {
      navigate("/create-company");
    }
  };

  const signup = async (data: SignupFormValues) => {
    const res = await apiSignup(data);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.companyId) {
      navigate("/dashboard");
    } else {
      navigate("/create-company");
    }
  };

  return {
    ...context,
    isAuthenticated,
    login,
    signup
  };
};
