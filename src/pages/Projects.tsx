
// import DashboardSidebar from '@/components/DashboardSidebar';
// import Header from '@/components/Header';
// import ProjectsList from '@/components/ProjectsList';
// import { Button } from '@/components/ui/button';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { toast } from '@/hooks/use-toast';
// import { useAuth } from '@/hooks/useAuth';
// import { createProject, getProjects } from "@/service/projects";
// import { ArrowLeft, Menu } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   status: 'active' | 'completed' | 'on-hold';
//   lastUpdated: string;
//   teamSize: number;
//   tags: string[];
// }

// const Projects = () => {
//   const isMobile = useIsMobile();
//   const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [projects, setProjects] = useState<Project[]>([]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const data = await getProjects();
//         setProjects(data);
//       } catch (err) {
//         toast({ title: "Error", description: "Failed to load projects" });
//       }
//     };
  
//     fetchProjects();
//   }, []);

//   const handleAddProject = async (project: Project) => {
//     try {
//       const newProject = await createProject(project);
//       const updatedProjects = [...projects, newProject];
//       setProjects(updatedProjects);
  
//       toast({
//         title: "Project created",
//         description: "Your new project has been created successfully.",
//       });
  
//       setTimeout(() => {
//         navigate(`/projects/${newProject.id}`);
//       }, 200);
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to create project" });
//     }
//   };
  

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <DashboardSidebar 
//         isMobile={isMobile} 
//         isOpen={sidebarOpen} 
//         onToggle={() => setSidebarOpen(!sidebarOpen)} 
//       />
      
//       <div className="flex-1 overflow-auto">
//         <Header />
        
//         {isMobile && !sidebarOpen && (
//           <Button
//             variant="ghost"
//             size="icon"
//             className="fixed top-4 left-4 z-50"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu />
//           </Button>
//         )}
        
//         <main className="container mx-auto py-8 px-4">
//           <div className="flex items-center mb-6">
//             <Link 
//               to="/dashboard" 
//               className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
//             >
//               <ArrowLeft className="h-4 w-4 mr-1" />
//               Back to Dashboard
//             </Link>
//           </div>

//           <ProjectsList 
//             projects={projects}
//             onAddProject={handleAddProject}
//           />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Projects;

// src/pages/ProjectPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById } from '@/service/projects';
import { getProjectTasks, Task, updateTask } from '@/service/tasks';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import YourExistingKanbanBoard from '@/components/YourExistingKanbanBoard'; // Your existing kanban component
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!user) {
      // Store current URL to redirect back after login
      sessionStorage.setItem('redirectUrl', window.location.pathname);
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch project and tasks in parallel
        const [projectData, tasksData] = await Promise.all([
          getProjectById(projectId),
          getProjectTasks(projectId)
        ]);
        
        setProject(projectData);
        setTasks(tasksData);
      } catch (err: any) {
        console.error('Error loading project:', err);
        setError(err.message || 'Failed to load project data');
        toast({ 
          title: "Error", 
          description: "Failed to load project data" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, user]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle error state
  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">
          {error || "Project not found"}
        </h2>
        <Link to="/projects" className="text-primary hover:underline">
          Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <main className="container mx-auto flex-1 p-4 flex flex-col">
        <div className="mb-6">
          <Link 
            to="/projects" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
          
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="text-sm bg-muted px-2 py-1 rounded">
              {project.status}
            </div>
          </div>
          
          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
          
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag: string) => (
                <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <YourExistingKanbanBoard 
            projectId={projectId as string} 
            initialTasks={tasks}
            onTasksChange={(updatedTasks) => setTasks(updatedTasks)}
          />
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;