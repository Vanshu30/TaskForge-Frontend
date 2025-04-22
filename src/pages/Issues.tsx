import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from "lucide-react";

const Issues = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is not logged in, redirect to login page
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="go back">
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Issues</h1>
        </div>
        <Header />
        
        <main className="container mx-auto py-6 px-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Issues Dashboard</h2>
            <p className="text-gray-500">
              This page is under construction. Soon you'll be able to view and manage all your project issues here.
            </p>
            
            <div className="mt-8 p-4 border border-dashed rounded-md text-center">
              <p className="text-muted-foreground">No issues found</p>
              <Button className="mt-4" onClick={() => navigate('/projects')}>
                Go to Projects
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Issues;
