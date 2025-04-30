import { verifyToken } from "@/lib/auth"; // your custom token auth
import { prisma } from "@/lib/prisma"; // your prisma client
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Create a new project
    try {
      const { name, description, companyId } = req.body;
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await verifyToken(token);

      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      if (!name || !companyId) {
        return res.status(400).json({ message: "Name and Company ID are required" });
      }

      const project = await prisma.project.create({
        data: {
          name,
          description,
          companyId,
        },
      });

      return res.status(200).json(project);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } 
  else if (req.method === "GET") {
    // Fetch all projects for the user's company
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await verifyToken(token);

      if (!user || !user.companyId) {
        return res.status(401).json({ message: "Invalid token or missing company" });
      }

      const projects = await prisma.project.findMany({
        where: {
          companyId: user.companyId,
        },
      });

      return res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } 
  else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
