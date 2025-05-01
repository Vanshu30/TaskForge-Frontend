import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (typeof taskId !== "string") {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    if (req.method === "GET") {
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (!task) return res.status(404).json({ error: "Task not found" });
      return res.status(200).json(task);
    }

    if (req.method === "PUT") {
      const result = updateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error });
      }
      const updated = await prisma.task.update({ where: { id: taskId }, data: result.data });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.task.delete({ where: { id: taskId } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}