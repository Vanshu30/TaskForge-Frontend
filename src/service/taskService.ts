import axiosInstance from '../Utils/axiosInstance';

export const fetchTaskById = (taskId: string) => {
  return axiosInstance.get(`/api/tasks/${taskId}`);
};
