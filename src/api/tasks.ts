import API from './axios';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await API.get<Task[]>('/api/tasks');
  return response.data;
};
