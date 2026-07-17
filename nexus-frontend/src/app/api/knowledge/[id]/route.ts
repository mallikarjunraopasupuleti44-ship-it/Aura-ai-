import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const doc = await prisma.knowledgeDocument.findUnique({
      where: { id },
    });

    if (!doc || doc.userId !== user.id) {
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
