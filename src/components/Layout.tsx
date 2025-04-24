
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        onToggle={handleToggleSidebar}
      />
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};
