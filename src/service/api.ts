const BASE_URL = import.meta.env.VITE_API_URL || '';

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};


export const createProject = async (projectData: any) => {
  const res = await fetch(`${BASE_URL}/projects/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
};