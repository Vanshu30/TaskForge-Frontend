import axios from 'axios';

export const fetchTaskById = (taskId: string) => {
  return axios.get(`/api/tasks/${taskId}`);
};