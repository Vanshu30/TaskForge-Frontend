import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  if (isAuthPage) return null; // Don't show header on auth pages

  return (
    <header className={`w-full z-50 ${isLandingPage ? 'absolute top-0 bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <svg viewBox="0 0 32 32" className="h-8 w-8 text-primary">
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
            <span className="text-xl font-bold text-jira-text">TaskFlow</span>
          </Link>

          {isMobile ? (
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>

              {mobileMenuOpen && (
                <div className="absolute left-0 right-0 top-16 bg-white shadow-md z-50 p-4 space-y-4 border-t">
                  {isLandingPage ? (
                    <>
                      <Link 
                        to="/signup" 
                        className="block w-full text-center py-2 font-medium text-jira-text hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get started
                      </Link>
                      <Link 
                        to="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full">Log in</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="block w-full text-center py-2 font-medium text-jira-text hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block w-full text-center py-2 font-medium text-jira-text hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Log out
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              {isLandingPage ? (
                <>
                  <Link to="/signup" className="font-medium text-jira-text hover:text-primary transition-colors">
                    Get started
                  </Link>
                  <Link to="/login">
                    <Button>Log in</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="font-medium text-jira-text hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="font-medium text-jira-text hover:text-primary transition-colors">
                    My Profile
                  </Link>
                  <Button variant="outline" onClick={logout}>
                    Log out
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
