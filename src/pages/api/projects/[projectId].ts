import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid projectId", details: parsed.error });
  }

  const { projectId } = parsed.data;

  try {
    const tasks = await prisma.task.findMany({ where: { projectId } });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks for project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
    if (req.method === "PUT") {
      const result = updateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error });
      }
      const updated = await prisma.project.update({ where: { id: projectId }, data: result.data });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.project.delete({ where: { id: projectId } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

