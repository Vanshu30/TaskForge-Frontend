import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TaskCard from './TaskCard';

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

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load tasks from localStorage
    const loadTasks = () => {
      try {
        // Load projects
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
          const projectsList = JSON.parse(storedProjects) as Project[];
          
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
          
          setTasks(allProjectTasks);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTasks();

    // Add event listeners for task updates
    const handleTaskUpdate = () => loadTasks();
    window.addEventListener('taskUpdate', handleTaskUpdate);
    window.addEventListener('taskAdd', handleTaskUpdate);
    window.addEventListener('taskDelete', handleTaskUpdate);
    
    return () => {
      window.removeEventListener('taskUpdate', handleTaskUpdate);
      window.removeEventListener('taskAdd', handleTaskUpdate);
      window.removeEventListener('taskDelete', handleTaskUpdate);
    };
  }, []);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              {task.projectName && (
                <div className="absolute top-2 right-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {task.projectName}
                </div>
              )}
              <Link to={`/projects/${task.projectId}`}>
                <TaskCard 
                  task={task} 
                  onClick={() => {
                    // This function is required by TaskCard props but will be handled by Link
                    // The click will navigate to the project page
                  }} 
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/30 rounded-lg border">
          <p className="text-muted-foreground">No tasks found. Create a new task to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
