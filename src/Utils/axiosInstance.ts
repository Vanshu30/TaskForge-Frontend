import axios from 'axios';

// Safely get API URL from environment, with a fallback
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'; 

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Add the token to every request (if present)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
