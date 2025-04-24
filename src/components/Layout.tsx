
import React from 'react';
import DashboardSidebar from './DashboardSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar 
        isMobile={false} 
        isOpen={true} 
        onToggle={() => {}}
      />
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};
