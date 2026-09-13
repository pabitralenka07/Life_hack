import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, confirmPassword } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    if (username.trim().length < 3) {
      return NextResponse.json(
        { error: "Codename must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Security key (password) must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { error: "Security keys do not match." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    // Check unique
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { username: cleanUsername }],
      },
    });

    if (existing) {
      if (existing.email === cleanEmail) {
        return NextResponse.json(
          { error: "An operative with this neural email is already registered." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "This operative codename is already taken." },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User, Character, 4 Attributes, and starter quests
    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        avatarUrl: "cyber-avatar-1",
      },
    });

    const character = await prisma.character.create({
      data: {
        userId: user.id,
        level: 1,
        currentXP: 0,
        totalXP: 0,
        gold: 150,
        streakCurrent: 1,
        streakBest: 1,
        lastActivityDate: null,
      },
    });

    await prisma.attribute.createMany({
      data: [
        { characterId: character.id, name: "STRENGTH", value: 10, todayGains: 0 },
        { characterId: character.id, name: "INTELLECT", value: 10, todayGains: 0 },
        { characterId: character.id, name: "VITALITY", value: 10, todayGains: 0 },
        { characterId: character.id, name: "DISCIPLINE", value: 10, todayGains: 0 },
      ],
    });

    // Starter Quests
    await prisma.quest.createMany({
      data: [
        {
          userId: user.id,
          title: "Neural Awakening: Plan Today's Quests",
          description: "Establish clear objectives for work, fitness, and intellectual growth.",
          category: "Personal",
          attribute: "DISCIPLINE",
          difficulty: 1,
          xpReward: 50,
          goldReward: 20,
          frequency: "DAILY",
          status: "ACTIVE",
        },
        {
          userId: user.id,
          title: "Physical Conditioning: 30-Min Workout",
          description: "Engage in gym training, bodyweight circuits, or outdoor running.",
          category: "Fitness",
          attribute: "STRENGTH",
          difficulty: 3,
          xpReward: 130,
          goldReward: 55,
          frequency: "DAILY",
          status: "ACTIVE",
        },
        {
          userId: user.id,
          title: "Deep Cognitive Sprint: 45 Minutes",
          description: "High-focus deep work without checking notifications or social feeds.",
          category: "Coding",
          attribute: "INTELLECT",
          difficulty: 2,
          xpReward: 85,
          goldReward: 35,
          frequency: "ONCE",
          status: "ACTIVE",
        },
      ],
    });

    const token = await signSessionToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Neural link registration failed. Guild servers unresponsive." },
      { status: 500 }
    );
  }
}
