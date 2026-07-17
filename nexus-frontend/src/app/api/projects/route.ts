import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { AGENT_DEFINITIONS, runAgentPipeline } from "@/lib/agent-pipeline";

export const dynamic = "force-dynamic";

// GET /api/projects — list user's projects
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        tasks: { select: { id: true, agentKey: true, status: true, deliverableType: true } },
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/projects — create a project + 5 idle tasks, kick off pipeline
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Business idea is required" }, { status: 400 });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title: title.trim(),
        status: "draft",
      },
    });

    // Create 5 idle AgentTask rows
    await Promise.all(
      AGENT_DEFINITIONS.map((agent) =>
        prisma.agentTask.create({
          data: {
            projectId: project.id,
            agentKey: agent.key,
            status: "idle",
            deliverableType: agent.deliverableType,
          },
        })
      )
    );

    // Log initial events
    await prisma.projectEvent.create({
      data: {
        projectId: project.id,
        agentKey: null,
        message: "Mission received... Analyzing business goal... Assembling AI workforce",
      },
    });

    // Also log to user activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        actionType: "PROJECT_CREATED",
        description: `Started new project: "${title.trim()}"`,
      },
    });

    // Kick off the agent pipeline in the background
    // Using fire-and-forget pattern (works with Vercel Edge/Serverless)
    runAgentPipeline(project.id, title.trim()).catch((err) => {
      console.error("Background pipeline error:", err);
    });

    return NextResponse.json({ project, message: "Project created. AI team deploying..." });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
