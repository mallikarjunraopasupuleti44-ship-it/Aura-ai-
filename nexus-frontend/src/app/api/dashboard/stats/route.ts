import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Fetch aggregated data
    const [agentsCount, documentsCount, automationsCount] = await Promise.all([
      prisma.hiredAgent.count({ where: { userId } }),
      prisma.knowledgeDocument.count({ where: { userId } }),
      prisma.automationWorkflow.count({ where: { userId } }),
    ]);

    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
      select: { businessName: true, industry: true },
    });

    return NextResponse.json({
      stats: {
        agentsCount,
        documentsCount,
        automationsCount,
      },
      profile,
    });
  } catch (error) {
    console.error("GET Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
