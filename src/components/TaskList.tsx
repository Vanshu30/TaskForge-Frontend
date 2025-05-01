import { getTasks } from '@/service/taskService'; // ✅ your backend function
import { useEffect, useState } from 'react';
import TaskCard from './TaskCard';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignee: { name: string; avatar?: string };
  type?: string;
  comments: any[];
}

interface Props {
  projectId: string;
}

const TaskList = ({ projectId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getTasks(projectId, token)
      .then(setTasks)
      .catch((err) => console.error("Error loading tasks:", err))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Loading tasks...</div>;

  const handleTaskClick = (taskId: string) => {
    console.log(`Task clicked: ${taskId}`);
    // You can implement navigation to task details or other actions here
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id}>
              <TaskCard 
                task={task} 
                onClick={() => handleTaskClick(task.id)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/30 rounded-lg border">
          <p className="text-muted-foreground">No tasks found for this project.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
