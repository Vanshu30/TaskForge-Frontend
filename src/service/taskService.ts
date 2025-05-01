import axios from "../api/axios";

interface TaskData {
  title: string;
  description?: string;
}

export const createTask = async (
  projectId: string,
  data: { title: string; description?: string },
  token: string
) => {
  const response = await axios.post("/task/create", {
    ...data,
    projectId
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};


export const getTasks = async (
  projectId: string,
  token: string
) => {
  const response = await axios.get(`/task/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchTaskById = async (
  taskId: string,
  token: string
) => {
  const response = await axios.get(`/api/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteTask = async (taskId: string, token: string) => {
  const response = await axios.delete(`/task/delete/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTask = async (
  taskId: string,
  data: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    type?: string;
    assignee?: string | null;
  },
  token: string
) => {
  const response = await axios.put(`/task/update/${taskId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

