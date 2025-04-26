// import axios from 'axios';

// export const fetchTaskById = (taskId: string) => {
//   return axios.get(`/api/tasks/${taskId}`);
// };
// src/service/tasks.ts
import { apiRequest } from '@/api/client';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedTo?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedTo?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
  return apiRequest<Task[]>(`/api/projects/${projectId}/tasks`);
};

export const createTask = async (task: CreateTaskInput): Promise<Task> => {
  return apiRequest<Task>(`/api/projects/${task.projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(task)
  });
};

export const updateTask = async (
  taskId: string, 
  projectId: string, 
  updates: Partial<Task>
): Promise<Task> => {
  return apiRequest<Task>(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
};

export const deleteTask = async (taskId: string, projectId: string): Promise<void> => {
  return apiRequest<void>(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE'
  });
};