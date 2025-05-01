import axios from "../api/axios";

export const createProject = async (data: { 
  name: string; 
  companyId: string;
  description?: string; 
}) => {
  // If description is not provided, set a default empty string
  const projectData = {
    ...data,
    description: data.description || ""
  };
  
  const response = await axios.post("/project/create", projectData);
  return response.data;
};

export const getProjects = async (companyId: string) => {
  const response = await axios.get(`/project/company/${companyId}`);
  return response.data;
};

export const fetchProjectById = async (id: string, token: string) => {
  const response = await axios.get(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};