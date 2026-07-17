import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/projects/[id]/events — get events for live feed polling
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const url = new URL(req.url);
    const after = url.searchParams.get("after");

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      select: { id: true, status: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Build query — optionally filter events after a timestamp
    const whereClause: any = { projectId: id };
    if (after) {
      whereClause.createdAt = { gt: new Date(after) };
    }

    const events = await prisma.projectEvent.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Also get current task statuses for live status updates
    const tasks = await prisma.agentTask.findMany({
      where: { projectId: id },
      select: { id: true, agentKey: true, status: true, deliverableType: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ events, tasks, projectStatus: project.status });
  } catch (error) {
    console.error("GET /api/projects/[id]/events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
