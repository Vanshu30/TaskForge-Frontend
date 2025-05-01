import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.taskId as string;

  if (req.method === "GET") {
    const subtasks = await prisma.task.findMany({
      where: { parentId: taskId },
    });
    return res.status(200).json({ subtasks });
  }

  if (req.method === "POST") {
    const { title, status } = req.body;
    const subtask = await prisma.task.create({
      data: { title, status, parentId: taskId },
    });
    return res.status(201).json({ subtask });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
