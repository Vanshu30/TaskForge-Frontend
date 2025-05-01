import axios from "../api/axios";

export const createProject = (data: { name: string; description: string; companyId: string; }) => {
  return axios.post("/project/create", data);
};

export const getProjects = (companyId: string) => {
  return axios.get(`/project/company/${companyId}`);
};

export const fetchProjectById = async (id: string, token: string) => {
  const response = await axios.get(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};