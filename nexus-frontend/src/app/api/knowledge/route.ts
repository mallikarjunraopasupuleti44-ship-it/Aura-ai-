import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await prisma.knowledgeDocument.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("GET Knowledge Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "All";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Prepare upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize filename and save locally
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, filename);
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // Save to DB
    const doc = await prisma.knowledgeDocument.create({
      data: {
        userId: session.user.id,
        filename: file.name,
        fileType: file.name.split('.').pop() || "unknown",
        fileUrl: `/uploads/${filename}`,
        sizeBytes: file.size,
        status: "READY",
        // HACK: Use extractedText to store folder name temporarily since we didn't add a folder column
        extractedText: folder, 
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: "KNOWLEDGE_UPLOAD",
        description: `Uploaded document: ${file.name} to ${folder}`,
      }
    });

    return NextResponse.json({ document: doc, message: "File uploaded successfully" });
  } catch (error) {
    console.error("POST Knowledge Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
