"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../service/taskService";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email?: string;
}

interface TaskManagerProps {
  projectId: string;
  token: string;
  teamMembers: TeamMember[];
}

export default function TaskManager({ projectId, token, teamMembers }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "medium",
    dueDate: "",
    assignee: "unassigned",
  });

  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "medium",
    dueDate: "",
    assignee: "unassigned",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(projectId, token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId, token]);

  const handleCreate = async () => {
    if (!newTask.title.trim()) return;
    try {
      const created = await createTask(projectId, newTask, token);
      setTasks((prev) => [...prev, created]);

      // 🔄 Notify Kanban
      window.dispatchEvent(new CustomEvent("taskAdd", {
        detail: { task: created, projectId },
      }));

      setNewTask({
        title: "",
        description: "",
        status: "TODO",
        priority: "medium",
        dueDate: "",
        assignee: "unassigned",
      });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id, token);
      setTasks((prev) => prev.filter((t) => t.id !== id));

      window.dispatchEvent(new CustomEvent("taskDelete", {
        detail: { taskId: id, projectId },
      }));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const updated = await updateTask(id, editFields, token);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      window.dispatchEvent(new CustomEvent("taskUpdate", {
        detail: { taskId: id },
      }));

      setEditTaskId(null);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const renderTask = (task: Task) => {
    const isEditing = task.id === editTaskId;
    return (
      <div key={task.id} className="border rounded p-2 bg-white space-y-1">
        {isEditing ? (
          <>
            <input
              className="w-full border px-2 py-1 rounded"
              value={editFields.title}
              onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
              aria-label="Task title"
            />
            <textarea
              className="w-full border px-2 py-1 rounded"
              value={editFields.description}
              onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
              aria-label="Task description"
            />
            <div className="flex gap-2">
              <select
                value={editFields.status}
                onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                className="border px-2 py-1 rounded"
                aria-label="Task status"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
              <select
                value={editFields.priority}
                onChange={(e) => setEditFields({ ...editFields, priority: e.target.value })}
                className="border px-2 py-1 rounded"
                aria-label="Task priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={editFields.assignee}
                onChange={(e) => setEditFields({ ...editFields, assignee: e.target.value })}
                className="border px-2 py-1 rounded"
                aria-label="Task assignee"
              >
                <option value="unassigned">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={editFields.dueDate || ""}
                onChange={(e) => setEditFields({ ...editFields, dueDate: e.target.value })}
                className="border px-2 py-1 rounded"
                aria-label="Task due date"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(task.id)} className="bg-green-600 text-white px-3 py-1 rounded">
                Save
              </button>
              <button onClick={() => setEditTaskId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="font-medium">{task.title}</div>
            {task.description && <div className="text-sm text-gray-600">{task.description}</div>}
            <div className="text-xs text-gray-500">Status: {task.status}</div>
            <div className="text-xs text-gray-500">Priority: {task.priority}</div>
            {task.assignee && <div className="text-xs text-gray-500">Assignee: {task.assignee}</div>}
            {task.dueDate && (
              <div className="text-xs text-gray-500">Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setEditTaskId(task.id);
                  setEditFields({
                    title: task.title,
                    description: task.description || "",
                    status: task.status,
                    priority: task.priority || "medium",
                    dueDate: task.dueDate || "",
                    assignee: task.assignee || "unassigned",
                  });
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(task.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-lg font-semibold">Task Manager</h2>

      {/* Task List */}
      <div className="space-y-3">
        {loading ? <p>Loading...</p> : tasks.map(renderTask)}
      </div>

      {/* Create Task */}
      <div className="border-t pt-4 space-y-2">
        <h3 className="text-md font-semibold">Create New Task</h3>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border px-2 py-1 w-full rounded"
          aria-label="New task title"
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border px-2 py-1 w-full rounded"
          aria-label="New task description"
        />
        <div className="flex gap-2">
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            className="border px-2 py-1 rounded"
            aria-label="New task status"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="border px-2 py-1 rounded"
            aria-label="New task priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={newTask.assignee}
            onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
            className="border px-2 py-1 rounded"
            aria-label="New task assignee"
          >
            <option value="unassigned">Unassigned</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="border px-2 py-1 rounded"
            aria-label="New task due date"
          />
        </div>
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
