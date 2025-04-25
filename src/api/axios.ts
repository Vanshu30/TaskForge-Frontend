import axios from 'axios';

const API = axios.create({
  baseURL: 'https://taskforge-backend-pdg6.onrender.com',
  withCredentials: true, 
});

export default API;
