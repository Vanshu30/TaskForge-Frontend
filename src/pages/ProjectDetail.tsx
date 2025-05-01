import KanbanBoard from '@/components/KanbanBoard';
import { Layout } from '@/components/Layout';
import TaskManager from "@/components/TaskManager";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { fetchProjectById } from '@/service/project';
import { deleteTask } from '@/service/taskService';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  comments: Array<{
    id: string;
    user: string;
    text: string;
    timestamp: string;
  }>;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(`team_${projectId}`);
    if (stored) {
      setTeamMembers(JSON.parse(stored));
    }
  }, [projectId]);
  
  useEffect(() => {
    if (!projectId || !user?.token) return;
  
    fetchProjectById(projectId, user.token)
      .then(setProject)
      .catch((err) => {
        console.error("Failed to load project:", err);
        toast({
          title: "Error",
          description: "Unable to load project",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [projectId, user?.token]);
  

  const handleTaskDelete = async (taskId: string) => {
    if (!taskId || !user?.token) return;
  
    try {
      // First, delete the task from the backend
      await deleteTask(taskId, user.token);
      
      console.log("ProjectDetail - Starting task deletion for taskId:", taskId);
      
      // Get current tasks and columns from localStorage
      const tasksKey = `tasks_${projectId}`;
      const columnsKey = `columns_${projectId}`;
      
      const storedTasks = localStorage.getItem(tasksKey);
      const storedColumns = localStorage.getItem(columnsKey);
      
      if (!storedTasks || !storedColumns) {
        console.error("Could not find tasks or columns in local storage");
        toast({
          title: "Error",
          description: "Could not find tasks or columns in storage",
          variant: "destructive"
        });
        return;
      }
      
      const tasks = JSON.parse(storedTasks);
      const columns = JSON.parse(storedColumns);
      
      // Remove the task from tasks object
      const updatedTasks = { ...tasks };
      delete updatedTasks[taskId];
      
      // Remove the task from all columns
      const updatedColumns = { ...columns };
      
      // Update each column's taskIds array
      Object.keys(updatedColumns).forEach(columnId => {
        updatedColumns[columnId] = {
          ...updatedColumns[columnId],
          taskIds: updatedColumns[columnId].taskIds.filter((id: string) => id !== taskId)
        };
      });
      
      // Save updated tasks and columns to localStorage
      localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
      localStorage.setItem(columnsKey, JSON.stringify(updatedColumns));
      
      console.log("Task deleted successfully from storage");
      
      // Show success toast
      toast({
        title: "Task deleted",
        description: "Task has been removed from the board"
      });
      
      // Dispatch custom event to update the board
      const deleteEvent = new CustomEvent('taskDelete', {
        detail: { taskId, projectId }
      });
      window.dispatchEvent(deleteEvent);
      
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </Layout>
    );
  }

  // Ensure projectId is defined before rendering
  if (!projectId) {
    return (
      <Layout>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Invalid Project</h2>
          <p className="text-muted-foreground">
            No project ID was provided.
          </p>
        </div>
      </Layout>
    );
  }

  // Ensure projectId is defined before rendering
  if (!projectId) {
    return (
      <Layout>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Invalid Project</h2>
          <p className="text-muted-foreground">
            No project ID was provided.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{project.name} | TaskForge</title>
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>
      <KanbanBoard 
        projectId={projectId} 
        onTaskDelete={handleTaskDelete}
      />
      <TaskManager 
        projectId={projectId}
        token={user?.token || ""}
        teamMembers={teamMembers}
      />


    </Layout>
  );
};

export default ProjectDetail;

