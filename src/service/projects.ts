const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

// Input type for creating a new project (omitting id as it's typically generated on the server)
interface CreateProjectInput {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated?: string;
  teamSize?: number;
  tags?: string[];
}

export const getProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export const createProject = async (project: CreateProjectInput): Promise<Project> => {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
};
