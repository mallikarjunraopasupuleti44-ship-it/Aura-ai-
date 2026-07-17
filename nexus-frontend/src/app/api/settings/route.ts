import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    let settings = {};
    if (user?.settings) {
      try {
        settings = JSON.parse(user.settings);
      } catch (e) {}
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settingsData = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: JSON.stringify(settingsData),
      },
      select: { settings: true },
    });

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("POST Settings Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
