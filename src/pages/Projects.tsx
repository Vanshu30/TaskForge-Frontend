
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import ProjectsList from '@/components/ProjectsList';
import { useAuth } from '@/context/AuthContext';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

const Projects = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const handleAddProject = (project: Project) => {
    console.log("Adding project:", project);
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Project created",
      description: "Your new project has been created successfully."
    });
    
    // Add a slight delay to ensure state has updated before navigation
    setTimeout(() => {
      console.log("Navigating to:", `/projects/${project.id}`);
      navigate(`/projects/${project.id}`);
    }, 200);
  };

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
        
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center mb-6">
            <Link 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <ProjectsList 
            projects={projects}
            onAddProject={handleAddProject}
          />
        </main>
      </div>
    </div>
  );
};

export default Projects;
