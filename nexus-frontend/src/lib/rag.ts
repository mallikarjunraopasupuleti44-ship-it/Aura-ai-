import prisma from "./prisma";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

export async function getBusinessContext(userId: string, query: string, maxTokens: number = 2000) {
  let context = "";

  // 1. Get Base Business Profile
  const profile = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (profile) {
    context += `[BUSINESS PROFILE]\n`;
    if (profile.businessName) context += `- Name: ${profile.businessName}\n`;
    if (profile.industry) context += `- Industry: ${profile.industry}\n`;
    if (profile.country) context += `- Location: ${profile.country}\n`;
    if (profile.targetAudience) context += `- Target Audience: ${profile.targetAudience}\n`;
    if (profile.mission) context += `- Mission: ${profile.mission}\n`;
    if (profile.products) context += `- Products/Services: ${profile.products}\n`;
    context += `\n`;
  }

  // 2. Perform Vector Search on KnowledgeChunks if we have OpenAI configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: [query],
      });
      const queryVector = `[${embeddings[0].join(",")}]`;

      // Search for top 5 most similar chunks
      const chunks: any[] = await prisma.$queryRawUnsafe(
        `SELECT content, 1 - (embedding <=> $1::vector) as similarity 
         FROM "KnowledgeChunk" 
         WHERE "userId" = $2 
         ORDER BY embedding <=> $1::vector 
         LIMIT 5`,
        queryVector,
        userId
      );

      if (chunks && chunks.length > 0) {
        context += `[RELEVANT KNOWLEDGE BASE]\n`;
        for (const chunk of chunks) {
          if (chunk.similarity > 0.2) { // arbitrary threshold
            context += `${chunk.content}\n\n`;
          }
        }
      }
    } catch (e) {
      console.error("RAG Search Error:", e);
    }
  } else {
    // Fallback: Just grab the first few documents text
    const docs = await prisma.knowledgeDocument.findMany({
      where: { userId },
      take: 3,
    });
    if (docs.length > 0) {
      context += `[KNOWLEDGE BASE]\n`;
      for (const doc of docs) {
        context += `${doc.filename}:\n${doc.extractedText}\n\n`;
      }
    }
  }

  return context;
}
