import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle,
  Calendar,
  LayoutDashboard,
  Mail,
  Settings,
  Users,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ListOrdered,
  AlertCircle,
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-secondary/50 text-gray-700'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
};

interface DashboardSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  isMobile, 
  isOpen, 
  onToggle 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  if (!isOpen && isMobile) {
    return null;
  }

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30" 
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <div
        className={`${
          isMobile
            ? 'fixed top-0 left-0 bottom-0 z-40 shadow-xl'
            : 'relative border-r'
        } ${
          collapsed && !isMobile ? 'w-16' : 'w-64'
        } bg-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
                <svg viewBox="0 0 32 32" className="h-5 w-5">
                  <path
                    d="M14 7C13.4477 7 13 7.44772 13 8V11C13 11.5523 13.4477 12 14 12H18C18.5523 12 19 11.5523 19 11V8C19 7.44772 18.5523 7 18 7H14Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7 14C7 13.4477 7.44772 13 8 13H11C11.5523 13 12 13.4477 12 14V18C12 18.5523 11.5523 19 11 19H8C7.44772 19 7 18.5523 7 18V14Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14 13C13.4477 13 13 13.4477 13 14V24C13 24.5523 13.4477 25 14 25H24C24.5523 25 25 24.5523 25 24V14C25 13.4477 24.5523 13 24 13H14Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg">TaskFlow</span>
            </div>
          )}

          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          )}
        </div>

        <div className="p-4 border-b">
          <div className="text-sm font-medium text-muted-foreground">ORGANIZATION</div>
          <div className="mt-1 font-semibold truncate">{user?.organizationName}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            <MenuItem 
              icon={<LayoutDashboard size={20} />} 
              label={collapsed ? '' : 'Dashboard'} 
              active={location.pathname === '/dashboard'}
              onClick={() => handleNavigation('/dashboard')}
            />
            <MenuItem 
              icon={<Briefcase size={20} />} 
              label={collapsed ? '' : 'Projects'} 
              active={location.pathname === '/projects' || location.pathname.startsWith('/projects/')}
              onClick={() => handleNavigation('/projects')}
            />
            <MenuItem 
              icon={<ListOrdered size={20} />} 
              label={collapsed ? '' : 'Tasks'} 
              active={location.pathname === '/tasks'}
              onClick={() => handleNavigation('/tasks')}
            />
            <MenuItem 
              icon={<Calendar size={20} />} 
              label={collapsed ? '' : 'Calendar'} 
              active={location.pathname === '/calendar'}
              onClick={() => handleNavigation('/calendar')}
            />
            <MenuItem 
              icon={<Users size={20} />} 
              label={collapsed ? '' : 'Teams'} 
              active={location.pathname === '/teams'}
              onClick={() => handleNavigation('/teams')}
            />
            <MenuItem 
              icon={<AlertCircle size={20} />} 
              label={collapsed ? '' : 'Issues'} 
              active={location.pathname === '/issues'}
              onClick={() => handleNavigation('/issues')}
            />
          </nav>
        </div>

        <div className="p-4 border-t">
          <MenuItem 
            icon={<Settings size={20} />} 
            label={collapsed ? '' : 'Settings'} 
            active={location.pathname === '/settings'}
            onClick={() => handleNavigation('/settings')}
          />
          <div 
            className="flex items-center mt-4 space-x-3 cursor-pointer"
            onClick={() => handleNavigation('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.name.charAt(0)}
            </div>
            {!collapsed && (
              <div>
                <div className="font-medium truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate">{user?.role}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
