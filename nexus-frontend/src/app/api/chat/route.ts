import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/utils/supabase/server";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();

    // Fetch context from DB
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: user.id },
    });

    const documents = await prisma.knowledgeDocument.findMany({
      where: { userId: user.id },
      select: { filename: true, extractedText: true },
    });

    // Construct system prompt
    let systemPrompt = `You are an expert AI Business Agent named "Planner Agent".
You are helping the user build and operate their business.

`;

    if (profile) {
      systemPrompt += `BUSINESS CONTEXT:\n`;
      if (profile.businessName) systemPrompt += `- Name: ${profile.businessName}\n`;
      if (profile.industry) systemPrompt += `- Industry: ${profile.industry}\n`;
      if (profile.mission) systemPrompt += `- Mission/Goal: ${profile.mission}\n`;
      systemPrompt += `\n`;
    }

    if (documents.length > 0) {
      systemPrompt += `KNOWLEDGE BASE CONTEXT (Use this to inform your answers):\n`;
      documents.forEach(doc => {
        systemPrompt += `[Document: ${doc.filename}]\n${doc.extractedText || "No extracted text"}\n\n`;
      });
    }

    // Call OpenAI via Vercel AI SDK
    // If OPENAI_API_KEY is not set, this will throw.
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse(JSON.stringify({ error: "Missing API Key. Please configure OPENAI_API_KEY." }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const result = await streamText({
      model: openai("gpt-4o") as any,
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
