import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/projects/[id]/stats — derived stats
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

    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      include: { tasks: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const tasks = project.tasks;

    const tasksCompleted = tasks.filter(
      (t) => t.status === "needs_review" || t.status === "approved"
    ).length;

    const agentsActive = tasks.filter(
      (t) => t.status === "working" || t.status === "queued"
    ).length;

    // Count words across all deliverables
    let wordsProduced = 0;
    for (const task of tasks) {
      if (task.deliverableContent) {
        wordsProduced += task.deliverableContent.split(/\s+/).length;
      }
    }

    // Hours saved heuristic: each completed deliverable saves ~1.4 hours
    const hoursSaved = Math.round(tasksCompleted * 1.4 * 10) / 10;

    return NextResponse.json({
      stats: {
        tasksCompleted,
        wordsProduced,
        hoursSaved,
        agentsActive,
      },
      projectStatus: project.status,
    });
  } catch (error) {
    console.error("GET /api/projects/[id]/stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
