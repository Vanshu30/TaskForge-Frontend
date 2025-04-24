
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/Layout';
import KanbanBoard from '@/components/KanbanBoard';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    
    // Get project details from localStorage
    const projects = localStorage.getItem('projects');
    if (projects) {
      const parsedProjects = JSON.parse(projects);
      const foundProject = parsedProjects.find((p: any) => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
      }
    }
    setLoading(false);
  }, [projectId]);

  const handleTaskDelete = (taskId: string) => {
    if (!projectId || !taskId) return;
    
    try {
      console.log("ProjectDetail - Handling task delete for taskId:", taskId);
      
      // Get current tasks and columns
      const tasksKey = `tasks_${projectId}`;
      const columnsKey = `columns_${projectId}`;
      
      const storedTasks = localStorage.getItem(tasksKey);
      const storedColumns = localStorage.getItem(columnsKey);
      
      if (!storedTasks || !storedColumns) {
        console.error("Could not find tasks or columns in local storage");
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
          taskIds: updatedColumns[columnId].taskIds.filter(id => id !== taskId)
        };
      });
      
      // Save updated tasks and columns to localStorage
      localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
      localStorage.setItem(columnsKey, JSON.stringify(updatedColumns));
      
      // Dispatch custom event to update the board
      const deleteEvent = new CustomEvent('taskDelete', {
        detail: { taskId, tasks: updatedTasks, columns: updatedColumns }
      });
      window.dispatchEvent(deleteEvent);
      
      console.log("Task deleted successfully");
      
      // Show success toast
      toast({
        title: "Task deleted",
        description: "Task has been removed from the board"
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Could not delete task",
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

  return (
    <Layout>
      <Helmet>
        <title>{project.name} | TaskFlow</title>
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
    </Layout>
  );
};

export default ProjectDetail;
