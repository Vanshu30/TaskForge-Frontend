
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Issues = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          isMobile={isMobile} 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
              <p className="text-gray-600">Manage and track issues across your projects.</p>
            </div>
            <Button className="w-full md:w-auto" size="lg">
              <Plus className="mr-1" />
              Add New Issue
            </Button>
          </div>

          {issues.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-500">Get started by creating your first issue.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Issue cards will be rendered here when we have issues */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Issues;

