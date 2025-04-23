
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import KanbanBoard from '@/components/KanbanBoard';
import TeamTab from '@/components/TeamTab';
import ProjectCalendar, { CalendarEvent } from '@/components/ProjectCalendar';
import ProjectTimeline from '@/components/ProjectTimeline';
import { useAuth } from '@/context/AuthContext';
import { Menu, Settings, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  status?: 'active' | 'completed' | 'on-hold';
  lastUpdated?: string;
  teamSize?: number;
  tags?: string[];
}

const ProjectDetail = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // Initialize project data
  useEffect(() => {
    if (projectId) {
      // Load project from localStorage
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const foundProject = projects.find((p: Project) => p.id === projectId);
        
        if (foundProject) {
          console.log("Project found:", foundProject);
          setProject(foundProject);
          
          // Load team members from localStorage
          const storedTeamMembers = localStorage.getItem(`team_${projectId}`);
          if (storedTeamMembers) {
            setTeamMembers(JSON.parse(storedTeamMembers));
          } else {
            setTeamMembers([]);
          }

          // Load tasks from localStorage
          const storedTasks = localStorage.getItem(`tasks_${projectId}`);
          if (storedTasks) {
            const tasksObj = JSON.parse(storedTasks);
            setTasks(Object.values(tasksObj));
          } else {
            setTasks([]);
          }
        } else {
          console.error("Project not found with ID:", projectId);
        }
      }
    }
  }, [projectId]);

  // Update tasks when changed in KanbanBoard
  useEffect(() => {
    const handleTasksChange = () => {
      const storedTasks = localStorage.getItem(`tasks_${projectId}`);
      if (storedTasks) {
        const tasksObj = JSON.parse(storedTasks);
        const taskArray = Object.values(tasksObj);
        setTasks(taskArray);
        
        // Update events based on tasks
        updateEventsFromTasks(taskArray);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleTasksChange);
    
    return () => {
      window.removeEventListener('storage', handleTasksChange);
    };
  }, [projectId]);

  // Update events based on tasks
  const updateEventsFromTasks = (tasksList: any[]) => {
    if (!tasksList || tasksList.length === 0) {
      setEvents([]);
      return;
    }

    const taskEvents: CalendarEvent[] = tasksList.map(task => ({
      id: `event-${task.id}`,
      title: `Due: ${task.title}`,
      description: task.description,
      date: new Date(task.dueDate).toISOString(),
      type: 'deadline',
      relatedTaskId: task.id,
      assignedTo: task.assignee?.id
    }));

    // Add some additional events
    const additionalEvents: CalendarEvent[] = [
      {
        id: 'event-meeting-1',
        title: 'Team Kickoff Meeting',
        description: 'Initial project planning and role assignments',
        date: new Date(2025, 3, 20).toISOString(),
        type: 'meeting'
      },
      {
        id: 'event-milestone-1',
        title: 'Design Phase Complete',
        description: 'All designs should be finalized and ready for development',
        date: new Date(2025, 4, 15).toISOString(),
        type: 'milestone'
      }
    ];
    
    setEvents([...taskEvents, ...additionalEvents]);
  };

  // Handle adding team members
  const handleAddTeamMember = (member: any) => {
    const updatedTeamMembers = [...teamMembers, member];
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem(`team_${projectId}`, JSON.stringify(updatedTeamMembers));
  };

  // Handle removing team members
  const handleRemoveTeamMember = (memberId: string) => {
    const updatedTeamMembers = teamMembers.filter(member => member.id !== memberId);
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem(`team_${projectId}`, JSON.stringify(updatedTeamMembers));
  };
  
  // Handle adding calendar events
  const handleAddEvent = (event: CalendarEvent) => {
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    // Get current tasks from localStorage
    const storedTasks = localStorage.getItem(`tasks_${projectId}`);
    const storedColumns = localStorage.getItem(`columns_${projectId}`);
    
    if (storedTasks && storedColumns) {
      // Update tasks
      const tasksObj = JSON.parse(storedTasks);
      delete tasksObj[taskId];
      
      // Update columns to remove the task ID
      const columnsObj = JSON.parse(storedColumns);
      Object.keys(columnsObj).forEach(columnId => {
        const column = columnsObj[columnId];
        column.taskIds = column.taskIds.filter((id: string) => id !== taskId);
        columnsObj[columnId] = column;
      });
      
      // Update localStorage
      localStorage.setItem(`tasks_${projectId}`, JSON.stringify(tasksObj));
      localStorage.setItem(`columns_${projectId}`, JSON.stringify(columnsObj));
      
      // Update state
      const taskArray = Object.values(tasksObj);
      setTasks(taskArray);
      
      // Update events
      updateEventsFromTasks(taskArray);
      
      // Show success message
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted."
      });
    }
  };

  // If user is not logged in, redirect to login page
  if (!user) {
    navigate('/login');
    return null;
  }

  // Show loading state while project is being fetched
  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Loading project...</h2>
          <p className="text-muted-foreground">
            If loading takes too long, <Link to="/projects" className="text-primary hover:underline">return to projects</Link>
          </p>
        </div>
      </div>
    );
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
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="board">
              <KanbanBoard 
                projectId={projectId} 
                onTaskDelete={handleDeleteTask}
              />
            </TabsContent>
            
            <TabsContent value="team">
              <TeamTab 
                projectId={projectId} 
                teamMembers={teamMembers} 
                onAddMember={handleAddTeamMember}
                onRemoveMember={handleRemoveTeamMember}
              />
            </TabsContent>
            
            <TabsContent value="calendar">
              <ProjectCalendar 
                events={events}
                teamMembers={teamMembers}
                tasks={tasks}
                onAddEvent={handleAddEvent}
              />
            </TabsContent>
            
            <TabsContent value="timeline">
              <ProjectTimeline tasks={tasks} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
