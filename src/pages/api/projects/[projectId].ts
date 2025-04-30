import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (req.method === "GET") {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId as string },
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.companyId !== decoded.companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { name, description, status } = req.body;

      const project = await prisma.project.findUnique({
        where: { id: projectId as string },
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.companyId !== decoded.companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedProject = await prisma.project.update({
        where: { id: projectId as string },
        data: {
          name,
          description,
          status,
          lastUpdated: new Date(), // Update the timestamp
        },
      });

      return res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId as string },
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.companyId !== decoded.companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await prisma.project.delete({
        where: { id: projectId as string },
      });

      return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
