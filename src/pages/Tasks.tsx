
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { Menu, ArrowLeft, Calendar, Filter, Bug, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TaskCard from '@/components/TaskCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Load all tasks from all projects
  useEffect(() => {
    // Load projects
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projectsList = JSON.parse(storedProjects);
      setProjects(projectsList);
      
      // Load tasks from each project
      const allProjectTasks: Task[] = [];
      
      projectsList.forEach((project: Project) => {
        const projectTasks = localStorage.getItem(`tasks_${project.id}`);
        if (projectTasks) {
          const tasksList = Object.values(JSON.parse(projectTasks)) as Task[];
          // Add project info to each task
          const tasksWithProject = tasksList.map(task => ({
            ...task,
            projectId: project.id,
            projectName: project.name
          }));
          allProjectTasks.push(...tasksWithProject);
        }
      });
      
      // Sort tasks by due date (nearest first)
      allProjectTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
      setAllTasks(allProjectTasks);
      setFilteredTasks(allProjectTasks);
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
            projectName: project.name
          }));
          allProjectTasks.push(...tasksWithProject);
        }
      });
      
      allProjectTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
      setAllTasks(allProjectTasks);
      applyFilters(allProjectTasks, selectedProject, selectedPriority, selectedType);
    }
  };
  
  // Apply filters
  const applyFilters = (tasks: Task[], project: string, priority: string, type: string) => {
    let result = tasks;
    
    if (project !== 'all') {
      result = result.filter(task => task.projectId === project);
    }
    
    if (priority !== 'all') {
      result = result.filter(task => task.priority === priority);
    }
    
    if (type !== 'all') {
      result = result.filter(task => task.type === type);
    }
    
    setFilteredTasks(result);
  };
  
  // Handle project filter change
  const handleProjectFilter = (value: string) => {
    setSelectedProject(value);
    applyFilters(allTasks, value, selectedPriority, selectedType);
  };
  
  // Handle priority filter change
  const handlePriorityFilter = (value: string) => {
    setSelectedPriority(value);
    applyFilters(allTasks, selectedProject, value, selectedType);
  };
  
  // Handle type filter change
  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
    applyFilters(allTasks, selectedProject, selectedPriority, value);
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
            <Link 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
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
                  <SelectItem value="low">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-medium">
              Results 
              <Badge variant="outline" className="ml-2">{filteredTasks.length} tasks</Badge>
            </h2>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map(task => (
                <div key={task.id} className="relative">
                  <Badge 
                    className="absolute -top-2 -right-2 z-10 bg-primary/10 text-primary border-primary/20"
                    variant="outline"
                  >
                    {task.projectName}
                  </Badge>
                  <TaskCard 
                    task={task} 
                    onClick={() => navigate(`/projects/${task.projectId}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <h3 className="font-medium text-lg mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {allTasks.length === 0 
                  ? "You don't have any tasks yet. Start by creating a new task in one of your projects."
                  : "No tasks match your current filters. Try changing your filter settings."
                }
              </p>
              <Button asChild>
                <Link to="/projects">
                  <Calendar className="mr-2 h-4 w-4" />
                  Go to Projects
                </Link>
              </Button>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Tasks;
