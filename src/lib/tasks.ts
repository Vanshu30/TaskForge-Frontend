import { Task, TaskStatus } from "@prisma/client";

const BASE_URL = "/api/projects";

export async function getTasks(projectId: string, token: string): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }

  return res.json();
}

export async function createTask(
  projectId: string,
  taskData: {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
  },
  token: string
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.statusText}`);
  }

  return res.json();
}
