
import DashboardSidebar from '@/components/DashboardSidebar';
import Header from '@/components/Header';
import ProjectsList from '@/components/ProjectsList';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { createProject, getProjects } from "@/service/projects";
import { ArrowLeft, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        toast({ title: "Error", description: "Failed to load projects" });
      }
    };
  
    fetchProjects();
  }, []);

  const handleAddProject = async (project: Project) => {
    try {
      const newProject = await createProject(project);
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
  
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
  
      setTimeout(() => {
        navigate(`/projects/${newProject.id}`);
      }, 200);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create project" });
    }
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

