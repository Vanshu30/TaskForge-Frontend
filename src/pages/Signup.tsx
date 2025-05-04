import AuthForm, { LoginFormValues } from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { SignupFormValues } from '@/context/AuthTypes';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from "../components/Topbar";
import { useTheme } from "../context/ThemeContext";

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (data: SignupFormValues | LoginFormValues) => {
    console.info('localStorage before signup:', Object.keys(localStorage));
    console.info('Raw users before signup:', localStorage.getItem('users'));

    setIsLoading(true);
    try {
      await signup(data as SignupFormValues); // Cast correctly
      console.log("Signup success! Redirecting...");
      navigate('/login'); // Redirect to login after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      // Optional: Show toast or alert
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Topbar toggleTheme={toggleTheme} />
      <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="relative mb-8">
              <div className="absolute left-0 top-0">
                <Button 
                  variant="ghost" 
                  className="text-xl font-bold" 
                  onClick={handleGoBack}
                >
                  &larr;
                </Button>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <svg viewBox="0 0 32 32" className="h-12 w-12 text-primary">
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
                </div>
                <h2 className={`mt-4 text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Create Your Account
                </h2>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join us to start managing your projects efficiently
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
      </div>
    </div>
  );
};

export default Signup;
