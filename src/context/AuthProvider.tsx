import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../api';
import { AuthContext, SignupFormValues, User } from './AuthTypes';

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

const login = async (email: string, password: string) => {
    try {
    setLoading(true);
      // Include a default role to satisfy the loginUser function requirements
      const response = await loginUser({ email, password, role: "Viewer" }); // 🔁 Connect to backend
    setUser(response.user || response);
    localStorage.setItem('user', JSON.stringify(response.user || response));
    } catch (error) {
    setUser(null);
    throw error;
    } finally {
    setLoading(false);
    }
};

const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedPlan');
    navigate('/login');
  };

  const signup = async (userData: SignupFormValues) => {
    try {
      setLoading(true);
      // Extract only the fields needed by the API
      const { name, email, password, organizationId, organizationName, role } = userData;
      const signupData = { name, email, password, organizationId, organizationName, role };
      const response = await signupUser(signupData); // 🔁 Connect to backend
      setUser(response.user || response);
      localStorage.setItem('user', JSON.stringify(response.user || response));
      navigate('/package-selection'); // or '/dashboard'
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

