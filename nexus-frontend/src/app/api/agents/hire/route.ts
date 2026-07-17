import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Default agents to hire based on the frontend configuration
    const agentsToHire = [
      { agentId: "planner", name: "Planner Agent", role: "Business Strategist" },
      { agentId: "marketing", name: "Marketing Agent", role: "Growth Marketer" },
      { agentId: "finance", name: "Finance Agent", role: "Financial Analyst" },
      { agentId: "operations", name: "Operations Agent", role: "Operations Manager" },
      { agentId: "website", name: "Website Agent", role: "Web Developer" }
    ];

    // Create hired agents in DB
    const hiredAgents = await Promise.all(
      agentsToHire.map(async (agent) => {
        // Upsert so if they already hired them, we just ensure they are active
        const existing = await prisma.hiredAgent.findFirst({
          where: { userId: session.user.id, agentId: agent.agentId }
        });

        if (existing) {
          return prisma.hiredAgent.update({
            where: { id: existing.id },
            data: { status: "ACTIVE" }
          });
        }

        return prisma.hiredAgent.create({
          data: {
            userId: session.user.id,
            agentId: agent.agentId,
            name: agent.name,
            role: agent.role,
            status: "ACTIVE",
            config: JSON.stringify({ initialPrompt: prompt })
          }
        });
      })
    );

    // Update business profile with the prompt as a starting point (if not already set)
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (profile && !profile.mission) {
      await prisma.businessProfile.update({
        where: { userId: session.user.id },
        data: { mission: prompt } // just a placeholder use of the prompt
      });
    }

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: "TEAM_DEPLOYED",
        description: `Deployed AI team for: "${prompt}"`,
      }
    });

    return NextResponse.json({ message: "Agents deployed successfully", agents: hiredAgents });
  } catch (error) {
    console.error("POST /api/agents/hire error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
