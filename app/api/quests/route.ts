import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDifficultyRewards } from "@/lib/game-engine";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const attribute = searchParams.get("attribute");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: Record<string, unknown> = {
      userId: session.userId,
    };

    if (attribute && attribute !== "ALL") {
      whereClause.attribute = attribute.toUpperCase();
    }
    if (category && category !== "ALL") {
      whereClause.category = category;
    }
    if (status && status !== "ALL") {
      whereClause.status = status.toUpperCase();
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const quests = await prisma.quest.findMany({
      where: whereClause,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, quests });
  } catch (error) {
    console.error("Quests fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      attribute,
      difficulty = 2,
      frequency = "ONCE",
      dueDate,
    } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Quest title cannot be empty." },
        { status: 400 }
      );
    }

    const validAttributes = ["STRENGTH", "INTELLECT", "VITALITY", "DISCIPLINE"];
    const normalizedAttribute = (attribute || "INTELLECT").toUpperCase();
    if (!validAttributes.includes(normalizedAttribute)) {
      return NextResponse.json(
        { error: "Invalid attribute. Must be STRENGTH, INTELLECT, VITALITY, or DISCIPLINE." },
        { status: 400 }
      );
    }

    const parsedDifficulty = Math.min(Math.max(Number(difficulty) || 1, 1), 5);
    const autoRewards = getDifficultyRewards(parsedDifficulty);
    const xpReward = Number(body.xpReward) || autoRewards.xp;
    const goldReward = Number(body.goldReward) || autoRewards.gold;

    const quest = await prisma.quest.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        description: description?.trim() || "",
        category: category?.trim() || "General",
        attribute: normalizedAttribute,
        difficulty: parsedDifficulty,
        xpReward,
        goldReward,
        frequency: frequency || "ONCE",
        dueDate: dueDate || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, quest }, { status: 201 });
  } catch (error) {
    console.error("Quest creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
