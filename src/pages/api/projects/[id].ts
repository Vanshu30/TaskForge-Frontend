import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  const token = authHeader.replace("Bearer ", "");
  
  try {
    const user = await verifyToken(token);
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    const project = await prisma.project.update({
      where: {
        id: params.id,
        companyId: user.companyId, // extra safety: update only if same company
      },
      data: {
        name,
        description,
      },
    });

    return Response.json(project);
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
}
