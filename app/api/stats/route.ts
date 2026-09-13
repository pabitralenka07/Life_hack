import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.userId },
      include: { attributes: true },
    });

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    const completions = await prisma.questCompletion.findMany({
      where: { userId: session.userId },
      include: { quest: true },
      orderBy: { completedAt: "desc" },
      take: 20,
    });

    const totalCompletionsCount = await prisma.questCompletion.count({
      where: { userId: session.userId },
    });

    // Attribute distribution
    const attrMap: Record<string, number> = {
      strength: 10,
      intellect: 10,
      vitality: 10,
      discipline: 10,
    };

    character.attributes.forEach((a) => {
      const key = a.name.toLowerCase();
      attrMap[key] = a.value;
    });

    // Compute weekly activity for last 7 days
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyActivity = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      const dayName = daysOfWeek[d.getDay()];

      // Count completions on this date
      const startOfDay = new Date(d.setHours(0, 0, 0, 0));
      const endOfDay = new Date(d.setHours(23, 59, 59, 999));

      const count = completions.filter((c) => {
        const cDate = new Date(c.completedAt);
        return cDate >= startOfDay && cDate <= endOfDay;
      }).length;

      weeklyActivity.push({
        day: dayName,
        date: dateString,
        completedCount: count,
        active: count > 0,
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalQuestsCompleted: totalCompletionsCount,
        totalXPEarned: character.totalXP,
        currentLevel: character.level,
        currentStreak: character.streakCurrent,
        bestStreak: character.streakBest,
        totalGoldEarned: character.gold,
        totalGoldSpent: 0,
        attributeDistribution: attrMap,
        recentCompletions: completions.map((c) => ({
          id: c.id,
          questTitle: c.quest?.title || "Classified Quest",
          attribute: c.attributeGranted,
          xpGranted: c.xpGranted,
          goldGranted: c.goldGranted,
          completedAt: c.completedAt.toISOString(),
        })),
        weeklyActivity,
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
