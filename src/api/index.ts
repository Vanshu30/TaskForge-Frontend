import axios from "axios";

export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get("/api/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // This should be an array of projects
};

export const updateProject = async (projectId: string, data: { name?: string; description?: string; status?: string; }) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`/api/projects/${projectId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
