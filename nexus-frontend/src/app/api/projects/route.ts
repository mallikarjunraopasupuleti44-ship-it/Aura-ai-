import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AGENT_DEFINITIONS = [
  { key: "planner", deliverableType: "Business Plan" },
  { key: "marketing", deliverableType: "Social Campaign" },
  { key: "finance", deliverableType: "Cost Analysis" },
  { key: "operations", deliverableType: "Weekly Schedule" },
  { key: "website", deliverableType: "Landing Page" }
];

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

// POST /api/projects — create a project + 5 idle tasks
// Client will then call /api/projects/[id]/run-agent for each agent
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
        status: "running",
      },
    });

    // Create 5 queued AgentTask rows
    await Promise.all(
      AGENT_DEFINITIONS.map((agent) =>
        prisma.agentTask.create({
          data: {
            projectId: project.id,
            agentKey: agent.key,
            status: "queued",
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
        message: `New mission: "${title.trim()}" — Assembling AI workforce...`,
      },
    });

    await prisma.projectEvent.create({
      data: {
        projectId: project.id,
        agentKey: null,
        message: "Orchestrator assigned tasks to 5 agents",
      },
    });

    // Log to user activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        actionType: "PROJECT_CREATED",
        description: `Started new project: "${title.trim()}"`,
      },
    });

    return NextResponse.json({ project, message: "Project created. Call /run-agent to start each agent." });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
