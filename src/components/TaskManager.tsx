"use client";

import { useEffect, useState } from "react";
import { createTask, getTasks } from "../service/taskService";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskManagerProps {
  projectId: string;
  token: string;
}

export default function TaskManager({ projectId, token }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(projectId, token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };

    fetchTasks();
  }, [projectId, token]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
  
    try {
      const created = await createTask(
        projectId,
        { title: newTitle, description: newDescription },
        token // ✅ Only one token
      );
      setTasks((prev) => [...prev, created]);
      setNewTitle("");
      setNewDescription("");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-lg font-semibold">Tasks</h2>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="border rounded p-2">
            <div className="font-medium">{task.title}</div>
            {task.description && <div className="text-sm text-gray-600">{task.description}</div>}
            <div className="text-xs text-gray-500">Status: {task.status}</div>
          </div>
        ))}
      </div>

      <div className="pt-4 space-y-2">
        <input
          type="text"
          placeholder="New task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border px-2 py-1 w-full rounded"
        />
        <textarea
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border px-2 py-1 w-full rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
