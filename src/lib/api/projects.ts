import axios from "axios";

export const updateProject = async (
  projectId: string,
  data: { name?: string; description?: string; status?: string }
) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`/api/projects/${projectId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getProject = async (projectId: string) => {
  const res = await fetch(`/api/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
};
