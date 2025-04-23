
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import ProjectsList from '@/components/ProjectsList';
import ProjectCalendar from '@/components/ProjectCalendar';
import { Calendar } from 'lucide-react';
import { List } from 'lucide-react';
import { Folder } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('tasks');

  // Placeholder data - you'll want to replace these with actual data from your context or API
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          isMobile={isMobile} 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : ''}`}>
          {isMobile && !sidebarOpen && (
            <Button 
              variant="outline" 
              size="icon" 
              className="mb-4" 
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </Button>
          )}
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-jira-text">Welcome back, {user.name}</h1>
            <p className="text-gray-600">Here's what's happening in your workspace today.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/teams')}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Team Members</CardTitle>
                <CardDescription>Active collaborators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">3 new this month</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <List size={16} />
                My Tasks
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Folder size={16} />
                Projects
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar size={16} />
                Calendar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              {/* Placeholder for tasks view */}
              <div className="text-center py-12 text-muted-foreground">
                No tasks available
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsList 
                projects={projects} 
                onAddProject={(newProject) => {
                  // Implement project addition logic
                  setProjects([...projects, newProject]);
                }} 
              />
            </TabsContent>
            <TabsContent value="calendar">
              <ProjectCalendar 
                events={events}
                teamMembers={teamMembers}
                tasks={tasks}
                onAddEvent={(newEvent) => {
                  // Implement event addition logic
                  setEvents([...events, newEvent]);
                }}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
