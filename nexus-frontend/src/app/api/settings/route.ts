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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { settings: true },
    });

    let settings = {};
    if (dbUser?.settings) {
      try {
        settings = JSON.parse(dbUser.settings);
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settingsData = await req.json();

    const dbUser = await prisma.user.update({
      where: { id: user.id },
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
