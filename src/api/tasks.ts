import { Task as PrismaTask, TaskStatus } from "@prisma/client";
import API from './axios';

// Use the Prisma-generated Task type
export type Task = PrismaTask;

// Define TaskDTO interface (for creating/updating tasks)
export interface TaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await API.get<Task[]>('/api/tasks');
  return response.data;
};

// Create a new task
export const createTask = async (taskData: TaskDTO): Promise<Task> => {
  const response = await API.post<Task>('/api/tasks/create', taskData);
  return response.data;
};

// Get task by ID
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await API.get<Task>(`/api/tasks/${id}`);
  return response.data;
};

// Update a task by ID
export const updateTask = async (id: string, updatedTask: TaskDTO): Promise<Task> => {
  const response = await API.put<Task>(`/api/tasks/${id}`, updatedTask);
  return response.data;
};

// Get count of tasks created in the last 7 days for a user
export const countTasksLast7Days = async (userId: string): Promise<number> => {
  const response = await API.get<number>(`/api/tasks/count/last-7-days/${userId}`);
  return response.data;
};

// Get completed tasks for the logged-in user in the last week
export const getCompletedTasksLastWeek = async (): Promise<{ totalCompletedTasks: number }> => {
  const response = await API.get<{ totalCompletedTasks: number }>('/api/tasks/completed-last-week');
  return response.data;
};

// Get the count of due soon tasks
export const countDueSoonTasks = async (): Promise<number> => {
  const response = await API.get<number>('/api/tasks/due-soon-tasks');
  return response.data;
};

// Get the count of tasks updated in the last 7 days
export const countTasksUpdatedLast7Days = async (): Promise<number> => {
  const response = await API.get<number>('/api/tasks/updated-last-7-days');
  return response.data;
};

// Get monthly completed tasks for the logged-in user
export const getMonthlyCompletedTasks = async (): Promise<{ [month: string]: number }> => {
  const response = await API.get<{ [month: string]: number }>('/api/tasks/tasks/monthly');
  return response.data;
};
