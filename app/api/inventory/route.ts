import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inventory = await prisma.inventoryItem.findMany({
      where: { userId: session.userId },
      include: {
        shopItem: true,
      },
      orderBy: [{ equipped: "desc" }, { acquiredAt: "desc" }],
    });

    return NextResponse.json({ success: true, inventory });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
