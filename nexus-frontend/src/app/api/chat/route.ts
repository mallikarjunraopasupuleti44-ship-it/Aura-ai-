import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();

    // Fetch context from DB
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
    });

    const documents = await prisma.knowledgeDocument.findMany({
      where: { userId: session.user.id },
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
      // Mock response for local development if no key is present
      const mockStream = new ReadableStream({
        async start(controller) {
          const text = "Hi! This is a mock response from the backend because OPENAI_API_KEY is not set in the environment. Your business profile and knowledge base were successfully loaded in the backend context!";
          const encoder = new TextEncoder();
          for (let i = 0; i < text.length; i++) {
            controller.enqueue(encoder.encode(`0:${JSON.stringify(text[i])}\n`));
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          controller.close();
        },
      });
      return new Response(mockStream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
