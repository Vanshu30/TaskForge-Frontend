import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fileId = req.query.fileId as string;

  if (req.method === "DELETE") {
    await prisma.file.delete({ where: { id: fileId } });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
