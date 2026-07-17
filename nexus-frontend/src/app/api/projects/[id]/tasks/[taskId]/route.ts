import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/projects/[id]/tasks/[taskId] — approve or request revision
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, taskId } = await params;
    const { action } = await req.json(); // "approve" or "revise"

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const task = await prisma.agentTask.findFirst({
      where: { id: taskId, projectId: id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (action === "approve") {
      await prisma.agentTask.update({
        where: { id: taskId },
        data: { status: "approved" },
      });

      const agentName = task.agentKey.charAt(0).toUpperCase() + task.agentKey.slice(1) + " Agent";

      await prisma.projectEvent.create({
        data: {
          projectId: id,
          agentKey: task.agentKey,
          message: `${agentName}'s ${task.deliverableType} has been approved ✅`,
        },
      });

      // Check if all tasks are approved
      const allTasks = await prisma.agentTask.findMany({
        where: { projectId: id },
      });
      const allApproved = allTasks.every((t) => t.status === "approved");

      if (allApproved) {
        await prisma.projectEvent.create({
          data: {
            projectId: id,
            agentKey: null,
            message: "✅ All deliverables approved · Your business is ready to launch!",
          },
        });
      }

      return NextResponse.json({ message: "Task approved", status: "approved" });
    } else if (action === "revise") {
      await prisma.agentTask.update({
        where: { id: taskId },
        data: { status: "working" },
      });

      await prisma.projectEvent.create({
        data: {
          projectId: id,
          agentKey: task.agentKey,
          message: `Revision requested for ${task.deliverableType}`,
        },
      });

      return NextResponse.json({ message: "Revision requested", status: "working" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/projects/[id]/tasks/[taskId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/projects/[id]/tasks/[taskId] — get a single task with its deliverable
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, taskId } = await params;

    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const task = await prisma.agentTask.findFirst({
      where: { id: taskId, projectId: id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("GET /api/projects/[id]/tasks/[taskId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
