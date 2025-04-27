const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

import {apiRequest} from '@/api/client';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
  userId?: string; //to track project ownership
}

// Input type for creating a new project (omitting id as it's typically generated on the server)
export interface CreateProjectInput {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated?: string;
  teamSize?: number;
  tags?: string[];
}

export const getProjects = async (): Promise<Project[]> => {
  // const res = await fetch(`${BASE_URL}/api/projects`);
  // if (!res.ok) throw new Error("Failed to fetch projects");
  // return res.json();
  return apiRequest<Project[]>('/api/projects');
};

export const getProjectsById = async (projectId: string): Promise<Project[]> => {
  return apiRequest<Project[]>(`/api/projects/${projectId}`);
}; 

// export const createProject = async (project: CreateProjectInput): Promise<Project> => {
//   const res = await fetch(`${BASE_URL}/api/projects`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(project),
//   });
//   if (!res.ok) throw new Error("Failed to create project");
//   return res.json();
// };

export const createProject = async (project: CreateProjectInput): Promise<Project> => {
  return apiRequest<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(project)
  });
};

export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<Project> => {
  return apiRequest<Project>(`/api/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
};

export const deleteProject = async (projectId: string): Promise<void> => {
  return apiRequest<void>(`/api/projects/${projectId}`, {
    method: 'DELETE'
  });
};