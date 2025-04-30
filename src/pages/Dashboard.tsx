import { getProjects } from '@/api';
import DashboardSidebar from '@/components/DashboardSidebar';
import Header from '@/components/Header';
import ProjectsList from '@/components/ProjectsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { ChartColumnStacked, CircleFadingArrowUp, ClockArrowDown, Folder, FolderPlus, Link2, List, Mail, Menu, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import the Project interface
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('tasks');

  // Placeholder data - you'll want to replace these with actual data from your context or API
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  useEffect(() => {
    getProjects().then(data => {
      // Ensure data is treated as Project[]
      setProjects(data as Project[]);
    }).catch(err => {
      console.error('Failed to load projects:', err);
    });
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    };

    fetchProjects();
  }, []);
  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };


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
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : 'max-w-7xl mx-auto'}`}>
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
          
          <div className="flex justify-end mb-6">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="flex items-center gap-2">
        <Plus size={16} />
        Invite
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={() => navigate('/invite')} className="flex items-center gap-2">
        <Mail size={16} />
        Invite by Email
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/generate-invite-link')} className="flex items-center gap-2">
        <Link2 size={16} />
        Generate Invite Link
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
<div className="flex justify-end mb-6">
  <Button onClick={() => navigate('/create-project')} className="flex items-center gap-2">
    <Plus size={16} />
    New Project
  </Button>
</div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/teams')}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                <ChartColumnStacked className="h-12 w-12" />
                </div>
              </CardHeader>
              <CardContent>
              <CardTitle className="text-lg">1 Completed</CardTitle>
              <CardDescription>In the last 7 days</CardDescription>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/teams')}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                <CircleFadingArrowUp className="h-12 w-12" />
                </div>
              </CardHeader>
              <CardContent>
              <CardTitle className="text-lg">1 Updated</CardTitle>
              <CardDescription>In the last 3 days</CardDescription>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/teams')}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                <FolderPlus className="h-12 w-12" />
                </div>
              </CardHeader>
              <CardContent>
              <CardTitle className="text-lg">1 Created</CardTitle>
              <CardDescription>In the last 2 days</CardDescription>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/teams')}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                <ClockArrowDown className="h-12 w-12" />
                </div>
              </CardHeader>
              <CardContent>
              <CardTitle className="text-lg">1 Due Soon</CardTitle>
              <CardDescription>In the last 7 days</CardDescription>
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
            </TabsList>
            <TabsContent value="tasks">
              {/* Placeholder for tasks view */}
              <div className="text-center py-12 text-muted-foreground">
                No tasks available
              </div>
            </TabsContent>
            <TabsContent value="projects">
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">My Projects</h1>
    <ProjectsList 
      projects={projects}
      onDelete={(id) => setProjects(projects.filter((p) => p.id !== id))}
    />
  </div>
</TabsContent>

          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;