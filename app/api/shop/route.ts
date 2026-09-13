import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopItems = await prisma.shopItem.findMany({
      orderBy: [{ category: "asc" }, { priceGold: "asc" }],
    });

    const userInventory = await prisma.inventoryItem.findMany({
      where: { userId: session.userId },
      select: { shopItemId: true, equipped: true },
    });

    const inventoryMap = new Map(
      userInventory.map((item) => [item.shopItemId, item.equipped])
    );

    const enrichedItems = shopItems.map((item) => ({
      ...item,
      owned: inventoryMap.has(item.id),
      equipped: inventoryMap.get(item.id) || false,
    }));

    return NextResponse.json({ success: true, items: enrichedItems });
  } catch (error) {
    console.error("Shop fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
