import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1),
  companyId: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const result = projectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error });
      }
      const project = await prisma.project.create({ data: result.data });
      return res.status(201).json(project);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create project" });
    }
  }

  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany();
      return res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch projects" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
