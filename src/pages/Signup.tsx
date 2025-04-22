
import React from 'react';
import AuthForm, { SignupFormValues } from '@/components/AuthForm';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Signup: React.FC = () => {
  const { user, signup, loading, error } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (data: SignupFormValues) => {
    signup(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="h-10 w-10 text-primary">
              <rect width="32" height="32" rx="4" fill="currentColor" />
              <path
                d="M14 7C13.4477 7 13 7.44772 13 8V11C13 11.5523 13.4477 12 14 12H18C18.5523 12 19 11.5523 19 11V8C19 7.44772 18.5523 7 18 7H14Z"
                fill="white"
              />
              <path
                d="M7 14C7 13.4477 7.44772 13 8 13H11C11.5523 13 12 13.4477 12 14V18C12 18.5523 11.5523 19 11 19H8C7.44772 19 7 18.5523 7 18V14Z"
                fill="white"
              />
              <path
                d="M14 13C13.4477 13 13 13.4477 13 14V24C13 24.5523 13.4477 25 14 25H24C24.5523 25 25 24.5523 25 24V14C25 13.4477 24.5523 13 24 13H14Z"
                fill="white"
              />
            </svg>
            <span className="ml-2 text-2xl font-bold text-jira-text">TaskFlow</span>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <AuthForm 
          type="signup" 
          onSubmit={handleSubmit} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Signup;
