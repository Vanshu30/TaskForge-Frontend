import DashboardSidebar from '@/components/DashboardSidebar';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, ArrowLeft, Bug, CheckCircle, Clock, Filter, Menu } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateTaskForm from '../components/CreateTaskForm';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  type?: string;
  comments: any[];
  projectId?: string;
  projectName?: string;
}

interface Project {
  id: string;
  name: string;
}

const Tasks = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Load all tasks from all projects
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projectsList = JSON.parse(storedProjects);
      setProjects(projectsList);

      const allProjectTasks: Task[] = [];
      projectsList.forEach((project: Project) => {
        const projectTasks = localStorage.getItem(`tasks_${project.id}`);
        if (projectTasks) {
          const tasksList = Object.values(JSON.parse(projectTasks)) as Task[];
          const tasksWithProject = tasksList.map(task => ({
            ...task,
            projectId: project.id,
            projectName: project.name,
          }));
          allProjectTasks.push(...tasksWithProject);
        }
      });

      allProjectTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setAllTasks(allProjectTasks);
    }

    // Add event listener for task updates
    window.addEventListener('taskUpdate', handleTaskUpdate as EventListener);
    window.addEventListener('taskAdd', handleTaskUpdate as EventListener);
    window.addEventListener('taskDelete', handleTaskDelete as EventListener);

    return () => {
      window.removeEventListener('taskUpdate', handleTaskUpdate as EventListener);
      window.removeEventListener('taskAdd', handleTaskUpdate as EventListener);
      window.removeEventListener('taskDelete', handleTaskDelete as EventListener);
    };
  }, []);

  // Handle task updates
  const handleTaskUpdate = (event: CustomEvent) => {
    refreshAllTasks();
  };

  // Handle task deletion
  const handleTaskDelete = (event: CustomEvent) => {
    refreshAllTasks();
  };

  // Refresh all tasks
  const refreshAllTasks = () => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projectsList = JSON.parse(storedProjects);
      const allProjectTasks: Task[] = [];

      projectsList.forEach((project: Project) => {
        const projectTasks = localStorage.getItem(`tasks_${project.id}`);
        if (projectTasks) {
          const tasksList = Object.values(JSON.parse(projectTasks)) as Task[];
          const tasksWithProject = tasksList.map(task => ({
            ...task,
            projectId: project.id,
            projectName: project.name,
          }));
          allProjectTasks.push(...tasksWithProject);
        }
      });

      allProjectTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setAllTasks(allProjectTasks);
    }
  };

  // Memoize the filtered tasks to avoid recalculating every time the component re-renders
  const filteredTasks = useMemo(() => {
    let result = allTasks;

    if (selectedProject !== 'all') {
      result = result.filter(task => task.projectId === selectedProject);
    }
    if (selectedPriority !== 'all') {
      result = result.filter(task => task.priority === selectedPriority);
    }
    if (selectedType !== 'all') {
      result = result.filter(task => task.type === selectedType);
    }

    return result;
  }, [allTasks, selectedProject, selectedPriority, selectedType]);

  // Handle project filter change
  const handleProjectFilter = (value: string) => {
    setSelectedProject(value);
  };

  // Handle priority filter change
  const handlePriorityFilter = (value: string) => {
    setSelectedPriority(value);
  };

  // Handle type filter change
  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
  };

  // Handle task card click
  const handleTaskClick = (taskId: string, projectId?: string) => {
    if (projectId) {
      navigate(`/projects/${projectId}/tasks/${taskId}`);
    } else {
      navigate(`/tasks/${taskId}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-4 w-4 mr-1 text-red-500" />;
      case 'feature':
        return <CheckCircle className="h-4 w-4 mr-1 text-green-500" />;
      case 'enhancement':
        return <AlertCircle className="h-4 w-4 mr-1 text-blue-500" />;
      case 'task':
      default:
        return <Clock className="h-4 w-4 mr-1 text-amber-500" />;
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
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">My Tasks</h1>
            <p className="text-muted-foreground">Manage and track all your tasks across different projects</p>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg mb-8 border">
            <h2 className="text-sm font-medium mb-3 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter Tasks
            </h2>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedProject} onValueChange={handleProjectFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="task">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                      Task
                    </div>
                  </SelectItem>
                  <SelectItem value="bug">
                    <div className="flex items-center">
                      <Bug className="h-4 w-4 mr-2 text-red-500" />
                      Bug
                    </div>
                  </SelectItem>
                  <SelectItem value="feature">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Feature
                    </div>
                  </SelectItem>
                  <SelectItem value="enhancement">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                      Enhancement
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={handlePriorityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <Card className="p-6">
              <h3>No tasks found. Try adjusting your filters or create a new task.</h3>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task: Task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => handleTaskClick(task.id, task.projectId)}
                />
              ))}
            </div>
          )}

          <CreateTaskForm />
        </main>
      </div>
    </div>
  );
};

export default Tasks;
