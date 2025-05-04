import { login as apiLogin, signup as apiSignup } from '@/service/authService';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, LoginFormValues, SignupFormValues, User } from './AuthTypes';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      console.log('AuthProvider login with:', data);
      const res = await apiLogin(data);
      const { token, user } = res.data;
      
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Login successful:', user);
      
      if (user.organizationId) {
        navigate('/dashboard');
      } else {
        navigate('/create-company');
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedPlan');
    navigate('/login');
  };

  const signup = async (userData: SignupFormValues) => {
    try {
      setLoading(true);
      console.log('AuthProvider signup with:', userData);
      const res = await apiSignup(userData);
      const { token, user } = res.data;
      
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Signup successful:', user);
      
      if (user.organizationId) {
        navigate('/dashboard');
      } else {
        navigate('/create-company');
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
};

