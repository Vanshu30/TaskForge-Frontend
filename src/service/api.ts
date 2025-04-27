const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};
