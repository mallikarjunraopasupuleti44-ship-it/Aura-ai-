import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const doc = await prisma.knowledgeDocument.findUnique({
      where: { id },
    });

    if (!doc || doc.userId !== session.user.id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete from filesystem
    if (doc.fileUrl) {
      const filePath = path.join(process.cwd(), "public", doc.fileUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("Could not delete file from disk:", err);
      }
    }

    // Delete from DB
    await prisma.knowledgeDocument.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("DELETE Knowledge Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
