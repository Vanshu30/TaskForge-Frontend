import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).transform(val => val as TaskStatus),
  projectId: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const result = taskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error });
      }
      const task = await prisma.task.create({ data: result.data });
      return res.status(201).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  }

  if (req.method === "GET") {
    try {
      const tasks = await prisma.task.findMany();
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

