import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { supabase as supabaseAdmin } from "@/lib/supabase"; // Uses Anon Key but works for public buckets

export const dynamic = 'force-dynamic';

function chunkText(text: string, maxWords: number = 300) {
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  for (const word of words) {
    currentChunk.push(word);
    if (currentChunk.length >= maxWords) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }
  return chunks;
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await prisma.knowledgeDocument.findMany({
      where: { userId: user.id },
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "All";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    
    // 1. Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from("documents")
      .upload(`${user.id}/${filename}`, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (storageError) {
      console.error("Supabase Storage Error:", storageError);
      // Fallback if bucket doesn't exist - we still proceed with DB/Vector ingestion
    }

    let fileUrl = "";
    if (storageData) {
      const { data } = supabaseAdmin.storage.from("documents").getPublicUrl(`${user.id}/${filename}`);
      fileUrl = data.publicUrl;
    }

    // 2. Parse Text
    let extractedText = "";
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (ext === "pdf") {
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (["txt", "csv", "md"].includes(ext || "")) {
      extractedText = buffer.toString("utf-8");
    } else {
      extractedText = `File uploaded: ${file.name} in folder: ${folder}.`;
    }

    // 3. Save to DB
    const doc = await prisma.knowledgeDocument.create({
      data: {
        userId: user.id,
        filename: file.name,
        fileType: ext || "unknown",
        fileUrl: fileUrl || "/placeholder",
        sizeBytes: file.size,
        status: "READY",
        extractedText: extractedText.substring(0, 5000), // Store preview/content
      },
    });

    // 4. Generate Embeddings (if OpenAI key is present)
    if (process.env.OPENAI_API_KEY && extractedText.trim().length > 10) {
      const chunks = chunkText(extractedText);
      
      try {
        const { embeddings } = await embedMany({
          model: openai.embedding("text-embedding-3-small"),
          values: chunks,
        });

        // Store vectors in Prisma using raw query since it's an Unsupported type
        for (let i = 0; i < chunks.length; i++) {
          await prisma.$executeRawUnsafe(
            `INSERT INTO "KnowledgeChunk" ("id", "userId", "documentId", "content", "embedding", "createdAt") 
             VALUES (gen_random_uuid(), $1, $2, $3, $4::vector, NOW())`,
            user.id,
            doc.id,
            chunks[i],
            `[${embeddings[i].join(",")}]`
          );
        }
      } catch (embedError) {
        console.error("Embedding Error:", embedError);
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        actionType: "KNOWLEDGE_UPLOAD",
        description: `Uploaded document: ${file.name}`,
      }
    });

    return NextResponse.json({ document: doc, message: "File uploaded successfully" });
  } catch (error) {
    console.error("POST Knowledge Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
