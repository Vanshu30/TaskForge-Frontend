import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  const decoded = await verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid token" });

  if (req.method === "POST") {
    try {
      const { title, description, status, dueDate, projectId } = req.body;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          projectId,
        },
      });

      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const { projectId } = req.query;
      if (!projectId || typeof projectId !== "string") {
        return res.status(400).json({ message: "Project ID is required" });
      }

      const tasks = await prisma.task.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
