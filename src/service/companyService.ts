import axios from "../api/axios";

export const createCompany = (data: { name: string; description: string; }) => {
  return axios.post("/company/create", data);
};

export const inviteUser = (data: { email: string; companyId: string; role: string; }) => {
  return axios.post("/invite/send", data);
};
