import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { SignupFormValues } from '@/context/AuthTypes';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (data: SignupFormValues) => {
    console.info('localStorage before signup:', Object.keys(localStorage));
    console.info('Raw users before signup:', localStorage.getItem('users'));
    
    setIsLoading(true);
    await signup(data);
    setIsLoading(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <svg viewBox="0 0 32 32" className="h-12 w-12 text-primary mx-auto">
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
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Start managing your projects efficiently and collaborate with your team
            </p>
          </div>
        </div>

        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default Signup;
