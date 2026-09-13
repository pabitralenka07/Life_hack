import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset current user's quests and attributes back to fresh demo state
    await prisma.questCompletion.deleteMany({
      where: { userId: session.userId },
    });
    await prisma.quest.deleteMany({
      where: { userId: session.userId },
    });

    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().split("T")[0];

    await prisma.character.update({
      where: { userId: session.userId },
      data: {
        level: 4,
        currentXP: 380,
        totalXP: 1420,
        gold: 420,
        streakCurrent: 5,
        streakBest: 12,
        lastActivityDate: yesterday,
      },
    });

    // Reset attributes
    const character = await prisma.character.findUnique({
      where: { userId: session.userId },
    });

    if (character) {
      await prisma.attribute.deleteMany({
        where: { characterId: character.id },
      });
      await prisma.attribute.createMany({
        data: [
          { characterId: character.id, name: "STRENGTH", value: 18, todayGains: 0 },
          { characterId: character.id, name: "INTELLECT", value: 26, todayGains: 2 },
          { characterId: character.id, name: "VITALITY", value: 15, todayGains: 0 },
          { characterId: character.id, name: "DISCIPLINE", value: 22, todayGains: 1 },
        ],
      });
    }

    // Recreate rich sample quests
    await prisma.quest.createMany({
      data: [
        {
          userId: session.userId,
          title: "Master Next.js App Router Architecture",
          description: "Study Server Actions, Streaming SSR, and Cache Components for high-perf web apps.",
          category: "Coding",
          attribute: "INTELLECT",
          difficulty: 4,
          xpReward: 190,
          goldReward: 85,
          frequency: "ONCE",
          status: "ACTIVE",
        },
        {
          userId: session.userId,
          title: "5km High-Intensity Interval Run",
          description: "Outdoor cardio session maintaining target heart rate zone 4 for 25+ minutes.",
          category: "Fitness",
          attribute: "VITALITY",
          difficulty: 3,
          xpReward: 130,
          goldReward: 55,
          frequency: "DAILY",
          status: "ACTIVE",
        },
        {
          userId: session.userId,
          title: "Heavy Deadlift Protocol (5x5)",
          description: "Complete 5 sets of 5 progressive overload deadlifts with pristine form.",
          category: "Fitness",
          attribute: "STRENGTH",
          difficulty: 4,
          xpReward: 190,
          goldReward: 85,
          frequency: "WEEKLY",
          status: "ACTIVE",
        },
        {
          userId: session.userId,
          title: "20-Min Neural Mindfulness Reset",
          description: "Deep somatic breathing and vipassana meditation to clear mental fog.",
          category: "Mindfulness",
          attribute: "DISCIPLINE",
          difficulty: 2,
          xpReward: 85,
          goldReward: 35,
          frequency: "DAILY",
          status: "ACTIVE",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Operative neural profile reset to default operational state.",
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
