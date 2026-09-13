import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { inventoryItemId } = body;

    if (!inventoryItemId) {
      return NextResponse.json({ error: "Inventory item ID required." }, { status: 400 });
    }

    const item = await prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, userId: session.userId },
      include: { shopItem: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Inventory item not found." }, { status: 404 });
    }

    const newEquippedState = !item.equipped;

    // If equipping, unequip any other item in the same category if category is THEMES or COSMETICS
    if (newEquippedState && (item.shopItem.category === "THEMES" || item.shopItem.category === "COSMETICS")) {
      const sameCategoryItems = await prisma.inventoryItem.findMany({
        where: {
          userId: session.userId,
          equipped: true,
          shopItem: { category: item.shopItem.category },
        },
      });

      for (const catItem of sameCategoryItems) {
        await prisma.inventoryItem.update({
          where: { id: catItem.id },
          data: { equipped: false },
        });
      }
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: { equipped: newEquippedState },
      include: { shopItem: true },
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: newEquippedState
        ? `Equipped ${item.shopItem.name}`
        : `Unequipped ${item.shopItem.name}`,
    });
  } catch (error) {
    console.error("Equip error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
