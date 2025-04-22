
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import KanbanBoard from '@/components/KanbanBoard';
import { useAuth } from '@/context/AuthContext';
import { Menu, Settings, Users, CalendarDays, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data until Supabase integration
const MOCK_PROJECTS = {
  '1': {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign company website with new branding',
  },
  '2': {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
  },
  '3': {
    id: '3',
    name: 'Q2 Marketing Campaign',
    description: 'Plan and execute Q2 marketing initiatives',
  }
};

const ProjectDetail = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // Get project details
  const project = projectId ? MOCK_PROJECTS[projectId] : null;

  // If user is not logged in, redirect to login page
  if (!user) {
    navigate('/login');
    return null;
  }

  // If project doesn't exist, redirect to projects page
  if (!project) {
    navigate('/projects');
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
        <Header />
        
        {isMobile && !sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
        )}
        
        <main className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors flex items-center mr-4">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </Button>
                <Link to={`/projects/${projectId}/settings`}>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="board" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="board">
              <KanbanBoard projectId={projectId} />
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <div className="text-center">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Calendar view coming soon</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline">
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <div className="text-center">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Timeline view coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
