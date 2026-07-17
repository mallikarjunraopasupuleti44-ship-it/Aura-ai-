import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { actionTitle } = await req.json();

    if (!actionTitle) {
      return NextResponse.json({ error: "Action title is required" }, { status: 400 });
    }

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: "QUICK_ACTION",
        description: `Executed Quick Action: ${actionTitle}`,
      }
    });

    // We can also potentially fire off a background AI workflow or trigger 
    // a real generation here. For now, we simulate success and log it.

    return NextResponse.json({ message: "Quick action executed and logged" });
  } catch (error) {
    console.error("POST /api/quick-action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
