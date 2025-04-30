import axios from "../api/axios"; // assuming axios base is configured

const API_URL = 'http://localhost:8080/api/v1';

export const login = (data: { email: string; password: string }) => {
  return axios.post('/auth/login', data);
};

export const signup = (data: { email: string; password: string; confirmPassword: string }) => {
  return axios.post('/auth/signup', data);
};

