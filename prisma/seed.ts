import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SHOP_CATALOG = [
  {
    name: "Neuro-Link HUD MK II",
    category: "THEMES",
    rarity: "EPIC",
    priceGold: 250,
    description: "A high-contrast cybernetic HUD interface enhancing mental acuity.",
    icon: "Cpu",
    effect: "+10% INT aesthetic aura",
  },
  {
    name: "Titanium Exosuit Frame",
    category: "COSMETICS",
    rarity: "RARE",
    priceGold: 180,
    description: "Reinforced alloy weave boosting daily physical resilience.",
    icon: "ShieldAlert",
    effect: "Armored character plating",
  },
  {
    name: "Quantum Focus Stim",
    category: "BOOSTERS",
    rarity: "UNCOMMON",
    priceGold: 75,
    description: "Direct neural stimulant that locks your brain into deep flow state.",
    icon: "Zap",
    effect: "+20 bonus XP on next quest",
  },
  {
    name: "Matrix Phosphor Theme",
    category: "THEMES",
    rarity: "LEGENDARY",
    priceGold: 500,
    description: "Emerald rain terminal palette designed for elite cyber operatives.",
    icon: "Terminal",
    effect: "Full cyber emerald visual reskin",
  },
  {
    name: "Shadowrunner Cloak",
    category: "COSMETICS",
    rarity: "EPIC",
    priceGold: 320,
    description: "Active stealth cloaking fabric designed for high-discipline routines.",
    icon: "Ghost",
    effect: "Discipline mastery glow",
  },
  {
    name: "Adrenaline Surge",
    category: "BOOSTERS",
    rarity: "COMMON",
    priceGold: 40,
    description: "Instant vitality recharge for intensive workout quests.",
    icon: "Flame",
    effect: "+10 bonus Gold on next quest",
  },
  {
    name: "Guild Vanguard Insignia",
    category: "BADGES",
    rarity: "RARE",
    priceGold: 120,
    description: "Awarded to operatives with unwavering 5+ day consistency.",
    icon: "Award",
    effect: "Vanguard profile badge",
  },
  {
    name: "Overclock Hyper-Core",
    category: "COSMETICS",
    rarity: "LEGENDARY",
    priceGold: 650,
    description: "Experimental bio-chip pulsating with purple neon hyper-currents.",
    icon: "Layers",
    effect: "Purple pulse animation aura",
  },
];

export async function main() {
  console.log("🌱 Starting Life RPG database seed...");

  // 1. Seed Shop Items
  console.log("📦 Seeding shop catalog...");
  for (const item of SHOP_CATALOG) {
    const existing = await prisma.shopItem.findFirst({
      where: { name: item.name },
    });
    if (!existing) {
      await prisma.shopItem.create({ data: item });
    }
  }

  // 2. Seed Demo User
  const demoEmail = "agent@liferpg.io";
  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!existingUser) {
    console.log("👤 Creating demo operative user...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("Password123!", salt);

    const user = await prisma.user.create({
      data: {
        username: "CyberOperative",
        email: demoEmail,
        passwordHash,
        avatarUrl: "cyber-avatar-1",
      },
    });

    // Yesterday's date
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().split("T")[0];

    // Create Character
    const character = await prisma.character.create({
      data: {
        userId: user.id,
        level: 4,
        currentXP: 380,
        totalXP: 1420,
        gold: 420,
        streakCurrent: 5,
        streakBest: 12,
        lastActivityDate: yesterday,
        soundEnabled: true,
        reducedMotion: false,
      },
    });

    // Attributes
    await prisma.attribute.createMany({
      data: [
        { characterId: character.id, name: "STRENGTH", value: 18, todayGains: 0 },
        { characterId: character.id, name: "INTELLECT", value: 26, todayGains: 2 },
        { characterId: character.id, name: "VITALITY", value: 15, todayGains: 0 },
        { characterId: character.id, name: "DISCIPLINE", value: 22, todayGains: 1 },
      ],
    });

    // Sample Quests
    const questsData = [
      {
        userId: user.id,
        title: "Master Next.js App Router Architecture",
        description: "Study Server Actions, Streaming SSR, and Cache Components for high-perf web apps.",
        category: "Coding",
        attribute: "INTELLECT",
        difficulty: 4,
        xpReward: 190,
        goldReward: 85,
        frequency: "ONCE",
        status: "ACTIVE",
      },
      {
        userId: user.id,
        title: "5km High-Intensity Interval Run",
        description: "Outdoor cardio session maintaining target heart rate zone 4 for 25+ minutes.",
        category: "Fitness",
        attribute: "VITALITY",
        difficulty: 3,
        xpReward: 130,
        goldReward: 55,
        frequency: "DAILY",
        status: "ACTIVE",
      },
      {
        userId: user.id,
        title: "Heavy Deadlift Protocol (5x5)",
        description: "Complete 5 sets of 5 progressive overload deadlifts with pristine form.",
        category: "Fitness",
        attribute: "STRENGTH",
        difficulty: 4,
        xpReward: 190,
        goldReward: 85,
        frequency: "WEEKLY",
        status: "ACTIVE",
      },
      {
        userId: user.id,
        title: "20-Min Neural Mindfulness Reset",
        description: "Deep somatic breathing and vipassana meditation to clear mental fog.",
        category: "Mindfulness",
        attribute: "DISCIPLINE",
        difficulty: 2,
        xpReward: 85,
        goldReward: 35,
        frequency: "DAILY",
        status: "ACTIVE",
      },
      {
        userId: user.id,
        title: "Review Distributed Systems Whitepaper",
        description: "Read Raft consensus algorithm paper and summarize leader election edge cases.",
        category: "Study",
        attribute: "INTELLECT",
        difficulty: 3,
        xpReward: 130,
        goldReward: 55,
        frequency: "ONCE",
        status: "ACTIVE",
      },
      {
        userId: user.id,
        title: "Clean & Optimize Cyber Battlestation",
        description: "Cable management, wipe down monitors, clean mechanical switches.",
        category: "Personal",
        attribute: "DISCIPLINE",
        difficulty: 1,
        xpReward: 50,
        goldReward: 20,
        frequency: "ONCE",
        status: "COMPLETED",
      },
      {
        userId: user.id,
        title: "8 Hours Restorative Deep Sleep",
        description: "Zero screens 60 minutes before bed; maintain optimal sleep environment.",
        category: "Health",
        attribute: "VITALITY",
        difficulty: 2,
        xpReward: 85,
        goldReward: 35,
        frequency: "DAILY",
        status: "COMPLETED",
      },
    ];

    for (const q of questsData) {
      await prisma.quest.create({ data: q });
    }

    // Give demo user some inventory
    const suitItem = await prisma.shopItem.findFirst({
      where: { name: "Titanium Exosuit Frame" },
    });
    const stimItem = await prisma.shopItem.findFirst({
      where: { name: "Quantum Focus Stim" },
    });

    if (suitItem) {
      await prisma.inventoryItem.create({
        data: {
          userId: user.id,
          shopItemId: suitItem.id,
          equipped: true,
        },
      });
    }

    if (stimItem) {
      await prisma.inventoryItem.create({
        data: {
          userId: user.id,
          shopItemId: stimItem.id,
          equipped: false,
        },
      });
    }

    // Achievements
    await prisma.achievement.createMany({
      data: [
        {
          userId: user.id,
          badgeKey: "FIRST_BLOOD",
          title: "First Quest Slain",
          description: "Completed your very first real-world quest.",
          icon: "Award",
        },
        {
          userId: user.id,
          badgeKey: "STREAK_5",
          title: "Cyber Consistency",
          description: "Maintained an unbroken 5-day quest streak.",
          icon: "Flame",
        },
      ],
    });

    console.log("✅ Demo operative created: agent@liferpg.io / Password123!");
  } else {
    console.log("⚡ Demo operative already exists.");
  }

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
