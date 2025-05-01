import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';
import { Folder, Home, LogOut, Plus, Users } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Projects', icon: Folder, path: '/projects' },
  { label: 'Teams', icon: Users, path: '/teams' },
  { label: 'Create Project', icon: Plus, path: '/create-project' },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isMobile, isOpen, onToggle }) => {
  const { logout } = useAuth();
  const location = useLocation();

  if (isMobile && !isOpen) return null;

  return (
    <aside
      className={clsx(
        'bg-white w-64 h-full shadow-md border-r transition-transform duration-200',
        isMobile ? 'fixed z-40 top-0 left-0' : 'sticky top-0'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="text-lg font-bold text-primary">TaskForge</div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Close sidebar">
            ✕
          </Button>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map(({ label, icon: Icon, path }) => (
          <Link key={path} to={path}>
            <div
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname === path
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
