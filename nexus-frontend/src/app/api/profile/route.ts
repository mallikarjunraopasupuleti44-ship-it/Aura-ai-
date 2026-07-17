import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const profile = await prisma.businessProfile.upsert({
      where: { userId: session.user.id },
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
        userId: session.user.id,
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
