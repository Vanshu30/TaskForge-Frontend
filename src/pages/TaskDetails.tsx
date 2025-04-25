// src/pages/TaskDetails.tsx
import { useEffect, useState } from 'react';
import { fetchTaskById } from '../service/taskService';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  type?: string;
  comments: Comment[];
  projectId?: string;
  projectName?: string;
}

const TaskDetails = () => {
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    // Example task ID - in a real app, you would get this from route params
    const taskId = 'xyz';
    
    fetchTaskById(taskId)
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
  }, []);

  return (
    <div>
      {task ? <pre>{JSON.stringify(task, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
};

export default TaskDetails;
