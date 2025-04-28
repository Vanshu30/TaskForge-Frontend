import axios from 'axios';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'in-progress';
  // Add other fields if necessary
}

export const fetchTaskById = async (taskId: string): Promise<Task> => {
  const response = await axios.get<Task>(`/api/tasks/${taskId}`);
  return response.data;
};
