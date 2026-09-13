import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
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
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, quest });
  } catch (error) {
    console.error("Quest get error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.quest.findFirst({
      where: { id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    const updatedQuest = await prisma.quest.update({
      where: { id },
      data: {
        ...(body.title ? { title: body.title.trim() } : {}),
        ...(body.description !== undefined ? { description: body.description.trim() } : {}),
        ...(body.category ? { category: body.category.trim() } : {}),
        ...(body.attribute ? { attribute: body.attribute.toUpperCase() } : {}),
        ...(body.difficulty ? { difficulty: Number(body.difficulty) } : {}),
        ...(body.xpReward ? { xpReward: Number(body.xpReward) } : {}),
        ...(body.goldReward ? { goldReward: Number(body.goldReward) } : {}),
        ...(body.frequency ? { frequency: body.frequency } : {}),
        ...(body.dueDate !== undefined ? { dueDate: body.dueDate } : {}),
        ...(body.status ? { status: body.status } : {}),
      },
    });

    return NextResponse.json({ success: true, quest: updatedQuest });
  } catch (error) {
    console.error("Quest update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.quest.findFirst({
      where: { id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    await prisma.quest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Quest deleted from log." });
  } catch (error) {
    console.error("Quest delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
