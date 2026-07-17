import prisma from "@/lib/prisma";

export async function logActivity(userId: string, actionType: string, description: string) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        actionType,
        description,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
