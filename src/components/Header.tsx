'use client';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) return null;

  return (
    <header className={`sticky top-0 z-50 w-full ${isLandingPage ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4 gap-4">
        <Link to="/" className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="h-6 w-6 text-primary shrink-0">
            <rect width="32" height="32" rx="4" fill="currentColor" />
            <path d="M14 7C13.4477 7 13 7.44772 13 8V11C13 11.5523 13.4477 12 14 12H18C18.5523 12 19 11.5523 19 11V8C19 7.44772 18.5523 7 18 7H14Z" fill="white" />
            <path d="M7 14C7 13.4477 7.44772 13 8 13H11C11.5523 13 12 13.4477 12 14V18C12 18.5523 11.5523 19 11 19H8C7.44772 19 7 18.5523 7 18V14Z" fill="white" />
            <path d="M14 13C13.4477 13 13 13.4477 13 14V24C13 24.5523 13.4477 25 14 25H24C24.5523 25 25 24.5523 25 24V14C25 13.4477 24.5523 13 24 13H14Z" fill="white" />
          </svg>
          <span className="text-lg font-semibold text-primary">TaskForge</span>
        </Link>

        {isMobile ? (
          <>
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
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 text-sm font-medium text-gray-800 hover:text-primary">Dashboard</Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 text-sm font-medium text-gray-800 hover:text-primary">My Profile</Link>
                    <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full text-sm">Log out</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full px-4 py-2 text-sm">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full px-4 py-2 text-sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-800 hover:text-primary">Dashboard</Link>
                <Link to="/profile" className="text-sm font-medium text-gray-800 hover:text-primary">My Profile</Link>
                <Button onClick={logout} variant="outline" className="text-sm">Log out</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-800 hover:text-primary">Login</Link>
                <Link to="/signup">
                  <Button className="text-sm px-4 py-2">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
