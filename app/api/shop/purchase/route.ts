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
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const shopItem = await prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!shopItem) {
      return NextResponse.json({ error: "Item not found in black market." }, { status: 404 });
    }

    const character = await prisma.character.findUnique({
      where: { userId: session.userId },
    });

    if (!character) {
      return NextResponse.json({ error: "Character profile missing." }, { status: 404 });
    }

    // Check if user already owns item
    const alreadyOwned = await prisma.inventoryItem.findFirst({
      where: { userId: session.userId, shopItemId: itemId },
    });

    if (alreadyOwned) {
      return NextResponse.json(
        { error: "You already own this cyber gear." },
        { status: 400 }
      );
    }

    // Check gold
    if (character.gold < shopItem.priceGold) {
      return NextResponse.json(
        {
          error: `Insufficient Gold. You require 🪙${shopItem.priceGold} Gold, but currently hold 🪙${character.gold} Gold.`,
        },
        { status: 400 }
      );
    }

    // Deduct gold and add inventory
    const [updatedCharacter, newInventoryItem] = await prisma.$transaction([
      prisma.character.update({
        where: { id: character.id },
        data: { gold: { decrement: shopItem.priceGold } },
      }),
      prisma.inventoryItem.create({
        data: {
          userId: session.userId,
          shopItemId: shopItem.id,
          equipped: false,
        },
        include: { shopItem: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Acquired ${shopItem.name}!`,
      newGold: updatedCharacter.gold,
      inventoryItem: newInventoryItem,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Transaction failed. Guild trade connection disrupted." },
      { status: 500 }
    );
  }
}
