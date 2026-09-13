import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requiredXPForLevel } from "@/lib/game-engine";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let character = await prisma.character.findUnique({
      where: { userId: session.userId },
      include: {
        attributes: true,
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!character) {
      // Auto-create character if missing
      character = await prisma.character.create({
        data: {
          userId: session.userId,
          level: 1,
          currentXP: 0,
          totalXP: 0,
          gold: 150,
          streakCurrent: 1,
          streakBest: 1,
        },
        include: {
          attributes: true,
          user: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
        },
      });

      await prisma.attribute.createMany({
        data: [
          { characterId: character.id, name: "STRENGTH", value: 10 },
          { characterId: character.id, name: "INTELLECT", value: 10 },
          { characterId: character.id, name: "VITALITY", value: 10 },
          { characterId: character.id, name: "DISCIPLINE", value: 10 },
        ],
      });

      character = await prisma.character.findUnique({
        where: { userId: session.userId },
        include: {
          attributes: true,
          user: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    const requiredXP = requiredXPForLevel(character.level);

    return NextResponse.json({
      success: true,
      character: {
        id: character.id,
        userId: character.userId,
        username: character.user.username,
        avatarUrl: character.user.avatarUrl,
        level: character.level,
        currentXP: character.currentXP,
        requiredXP,
        totalXP: character.totalXP,
        gold: character.gold,
        streakCurrent: character.streakCurrent,
        streakBest: character.streakBest,
        lastActivityDate: character.lastActivityDate,
        soundEnabled: character.soundEnabled,
        reducedMotion: character.reducedMotion,
        attributes: character.attributes,
      },
    });
  } catch (error) {
    console.error("Character fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { avatarUrl, soundEnabled, reducedMotion } = body;

    if (avatarUrl) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { avatarUrl },
      });
    }

    const updatedCharacter = await prisma.character.update({
      where: { userId: session.userId },
      data: {
        ...(soundEnabled !== undefined ? { soundEnabled } : {}),
        ...(reducedMotion !== undefined ? { reducedMotion } : {}),
      },
      include: {
        attributes: true,
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    const requiredXP = requiredXPForLevel(updatedCharacter.level);

    return NextResponse.json({
      success: true,
      character: {
        ...updatedCharacter,
        username: updatedCharacter.user.username,
        avatarUrl: updatedCharacter.user.avatarUrl,
        requiredXP,
      },
    });
  } catch (error) {
    console.error("Character update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
