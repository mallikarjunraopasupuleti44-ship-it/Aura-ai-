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

    const profile = await prisma.businessProfile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GET Profile Error:", error);
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

    const data = await req.json();

    const profile = await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: data.businessName,
        industry: data.industry,
        country: data.country,
        businessType: data.businessType,
        employees: data.employees,
        products: data.products,
        services: data.services,
        targetAudience: data.targetAudience,
        mission: data.mission,
        vision: data.vision,
        revenueModel: data.revenueModel,
        brandColors: data.brandColors,
        logoUrl: data.logoUrl,
        website: data.website,
        socialMedia: data.socialMedia,
        goals: data.goals,
        challenges: data.challenges,
        competitors: data.competitors,
      },
      create: {
        userId: user.id,
        businessName: data.businessName,
        industry: data.industry,
        country: data.country,
        businessType: data.businessType,
        employees: data.employees,
        products: data.products,
        services: data.services,
        targetAudience: data.targetAudience,
        mission: data.mission,
        vision: data.vision,
        revenueModel: data.revenueModel,
        brandColors: data.brandColors,
        logoUrl: data.logoUrl,
        website: data.website,
        socialMedia: data.socialMedia,
        goals: data.goals,
        challenges: data.challenges,
        competitors: data.competitors,
      },
    });

    return NextResponse.json({ profile, message: "Profile updated successfully" });
  } catch (error) {
    console.error("POST Profile Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
