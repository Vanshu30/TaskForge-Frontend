import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.taskId as string;

  if (req.method === "GET") {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json({ comments });
  }

  if (req.method === "POST") {
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: { taskId, content },
    });
    return res.status(201).json({ comment });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
