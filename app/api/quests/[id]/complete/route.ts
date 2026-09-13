import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  processXPGain,
  evaluateStreak,
  getTodayDateString,
  requiredXPForLevel,
} from "@/lib/game-engine";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const quest = await prisma.quest.findFirst({
      where: { id, userId: session.userId },
    });

    if (!quest) {
      return NextResponse.json(
        { error: "Quest not found in operative registry." },
        { status: 404 }
      );
    }

    if (quest.status === "COMPLETED" && quest.frequency === "ONCE") {
      return NextResponse.json(
        { error: "This quest has already been completed." },
        { status: 400 }
      );
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.userId },
      include: { attributes: true },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Operative character profile missing." },
        { status: 404 }
      );
    }

    // 1. Process XP Gain and Level progression
    const xpGain = quest.xpReward;
    const levelResult = processXPGain(
      character.level,
      character.currentXP,
      character.totalXP,
      xpGain
    );

    // 2. Process Gold Reward (Base + Level-up bonus)
    const goldGain = quest.goldReward;
    const totalGoldEarned = goldGain + levelResult.bonusGold;
    const newGoldBalance = character.gold + totalGoldEarned;

    // 3. Process Streak
    const streakResult = evaluateStreak(
      character.lastActivityDate,
      character.streakCurrent,
      character.streakBest
    );

    const todayStr = getTodayDateString();

    // 4. Attribute gain
    const attributeName = quest.attribute;
    const attributeGain = quest.difficulty >= 4 ? 2 : 1;

    // 5. Database transaction for atomic progression
    const [updatedQuest, updatedCharacter, , completion] = await prisma.$transaction([
      // Update quest status
      prisma.quest.update({
        where: { id: quest.id },
        data: {
          status: quest.frequency === "ONCE" ? "COMPLETED" : "ACTIVE",
          updatedAt: new Date(),
        },
      }),

      // Update character
      prisma.character.update({
        where: { id: character.id },
        data: {
          level: levelResult.newLevel,
          currentXP: levelResult.newCurrentXP,
          totalXP: levelResult.newTotalXP,
          gold: newGoldBalance,
          streakCurrent: streakResult.streakCurrent,
          streakBest: streakResult.streakBest,
          lastActivityDate: todayStr,
        },
        include: { attributes: true },
      }),

      // Update specific attribute
      prisma.attribute.updateMany({
        where: {
          characterId: character.id,
          name: attributeName,
        },
        data: {
          value: { increment: attributeGain },
          todayGains: { increment: attributeGain },
        },
      }),

      // Record completion
      prisma.questCompletion.create({
        data: {
          questId: quest.id,
          userId: session.userId,
          xpGranted: xpGain,
          goldGranted: goldGain,
          attributeGranted: attributeName,
          attributeAmount: attributeGain,
        },
      }),
    ]);

    // Check & award badges/achievements
    const totalCompletions = await prisma.questCompletion.count({
      where: { userId: session.userId },
    });

    const newAchievements: string[] = [];
    if (totalCompletions >= 1) {
      const existing = await prisma.achievement.findUnique({
        where: {
          userId_badgeKey: { userId: session.userId, badgeKey: "FIRST_BLOOD" },
        },
      });
      if (!existing) {
        await prisma.achievement.create({
          data: {
            userId: session.userId,
            badgeKey: "FIRST_BLOOD",
            title: "First Quest Slain",
            description: "Completed your very first real-world quest.",
            icon: "Award",
          },
        });
        newAchievements.push("First Quest Slain");
      }
    }

    if (streakResult.streakCurrent >= 5) {
      const existing = await prisma.achievement.findUnique({
        where: {
          userId_badgeKey: { userId: session.userId, badgeKey: "STREAK_5" },
        },
      });
      if (!existing) {
        await prisma.achievement.create({
          data: {
            userId: session.userId,
            badgeKey: "STREAK_5",
            title: "Cyber Consistency",
            description: "Maintained an unbroken 5-day quest streak.",
            icon: "Flame",
          },
        });
        newAchievements.push("Cyber Consistency");
      }
    }

    if (levelResult.newLevel >= 5) {
      const existing = await prisma.achievement.findUnique({
        where: {
          userId_badgeKey: { userId: session.userId, badgeKey: "LEVEL_5" },
        },
      });
      if (!existing) {
        await prisma.achievement.create({
          data: {
            userId: session.userId,
            badgeKey: "LEVEL_5",
            title: "Veteran Operative",
            description: "Reached Operative Level 5.",
            icon: "ShieldAlert",
          },
        });
        newAchievements.push("Veteran Operative");
      }
    }

    // Refresh updated attributes
    const refreshedAttributes = await prisma.attribute.findMany({
      where: { characterId: character.id },
    });

    const requiredXP = requiredXPForLevel(updatedCharacter.level);

    return NextResponse.json({
      success: true,
      quest: updatedQuest,
      completionId: completion.id,
      xpGranted: xpGain,
      goldGranted: goldGain,
      attributeGranted: attributeName,
      attributeAmount: attributeGain,
      newLevel: levelResult.newLevel,
      leveledUp: levelResult.leveledUp,
      levelsGained: levelResult.levelsGained,
      bonusGold: levelResult.bonusGold,
      streakUpdated: streakResult.streakIncremented,
      newStreak: streakResult.streakCurrent,
      newAchievements,
      character: {
        id: updatedCharacter.id,
        userId: updatedCharacter.userId,
        level: updatedCharacter.level,
        currentXP: updatedCharacter.currentXP,
        requiredXP,
        totalXP: updatedCharacter.totalXP,
        gold: updatedCharacter.gold,
        streakCurrent: updatedCharacter.streakCurrent,
        streakBest: updatedCharacter.streakBest,
        lastActivityDate: updatedCharacter.lastActivityDate,
        soundEnabled: updatedCharacter.soundEnabled,
        reducedMotion: updatedCharacter.reducedMotion,
        attributes: refreshedAttributes,
      },
    });
  } catch (error) {
    console.error("Quest completion error:", error);
    return NextResponse.json(
      { error: "The quest could not be completed — connection to the guild server was lost." },
      { status: 500 }
    );
  }
}
