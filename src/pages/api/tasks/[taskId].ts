import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  const decoded = await verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid token" });

  if (req.method === "GET") {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId as string },
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { title, description, status, dueDate } = req.body;

      const updatedTask = await prisma.task.update({
        where: { id: taskId as string },
        data: {
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.task.delete({
        where: { id: taskId as string },
      });

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
