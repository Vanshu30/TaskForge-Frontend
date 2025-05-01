// pages/api/tasks/[taskId]/files.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.taskId as string;

  if (req.method === "GET") {
    const files = await prisma.file.findMany({ where: { taskId } });
    return res.status(200).json({ files });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
