// src/pages/api/users/[userId].ts

import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const idSchema = z.object({
  userId: z.string().min(1),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const parsedId = idSchema.safeParse(req.query);
  if (!parsedId.success) {
    return res.status(400).json({ error: "Invalid user ID", details: parsedId.error });
  }

  const userId = parsedId.data.userId;

  try {
    if (req.method === "GET") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user
        ? res.status(200).json(user)
        : res.status(404).json({ error: "User not found" });
    }

    if (req.method === "PUT") {
      const parsedBody = updateUserSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid update data", details: parsedBody.error });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: parsedBody.data,
      });

      return res.status(200).json(updatedUser);
    }

    if (req.method === "DELETE") {
      await prisma.user.delete({ where: { id: userId } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("User ID handler error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
