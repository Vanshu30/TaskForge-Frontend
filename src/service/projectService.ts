import axios from "../api/axios";

export const createProject = (data: { name: string; description: string; companyId: string; }) => {
  return axios.post("/project/create", data);
};

export const getProjects = (companyId: string) => {
  return axios.get(`/project/company/${companyId}`);
};
