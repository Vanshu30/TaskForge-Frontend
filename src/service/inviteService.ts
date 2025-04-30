import axios from "../api/axios";

export const validateInvite = (token: string) => {
  return axios.get(`/invite/validate/${token}`);
};
