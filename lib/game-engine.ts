// Authoritative RPG Engine Logic
// All progression math is executed server-side.

export function requiredXPForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

export interface LevelProgressResult {
  newLevel: number;
  newCurrentXP: number;
  newTotalXP: number;
  levelsGained: number;
  bonusGold: number;
  leveledUp: boolean;
}

export function processXPGain(
  currentLevel: number,
  currentXP: number,
  totalXP: number,
  xpGained: number
): LevelProgressResult {
  let level = currentLevel;
  let xp = currentXP + xpGained;
  const newTotal = totalXP + xpGained;
  let levelsGained = 0;

  while (true) {
    const needed = requiredXPForLevel(level);
    if (xp >= needed) {
      xp -= needed;
      level += 1;
      levelsGained += 1;
    } else {
      break;
    }
  }

  const bonusGold = levelsGained * 100;

  return {
    newLevel: level,
    newCurrentXP: xp,
    newTotalXP: newTotal,
    levelsGained,
    bonusGold,
    leveledUp: levelsGained > 0,
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface StreakUpdateResult {
  streakCurrent: number;
  streakBest: number;
  streakIncremented: boolean;
  streakBroken: boolean;
  todayAlreadyActive: boolean;
}

export function evaluateStreak(
  lastActivityDate: string | null,
  currentStreak: number,
  bestStreak: number
): StreakUpdateResult {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (!lastActivityDate) {
    return {
      streakCurrent: 1,
      streakBest: Math.max(bestStreak, 1),
      streakIncremented: true,
      streakBroken: false,
      todayAlreadyActive: false,
    };
  }

  if (lastActivityDate === today) {
    // Already logged activity today, streak maintained
    return {
      streakCurrent: currentStreak,
      streakBest: bestStreak,
      streakIncremented: false,
      streakBroken: false,
      todayAlreadyActive: true,
    };
  }

  if (lastActivityDate === yesterday) {
    // Consecutive day! Streak increases
    const newStreak = currentStreak + 1;
    return {
      streakCurrent: newStreak,
      streakBest: Math.max(bestStreak, newStreak),
      streakIncremented: true,
      streakBroken: false,
      todayAlreadyActive: false,
    };
  }

  // More than 1 day missed: streak resets to 1
  return {
    streakCurrent: 1,
    streakBest: bestStreak,
    streakIncremented: true,
    streakBroken: true,
    todayAlreadyActive: false,
  };
}

export function getDifficultyRewards(difficulty: number): { xp: number; gold: number } {
  switch (difficulty) {
    case 1:
      return { xp: 50, gold: 20 };
    case 2:
      return { xp: 85, gold: 35 };
    case 3:
      return { xp: 130, gold: 55 };
    case 4:
      return { xp: 190, gold: 85 };
    case 5:
      return { xp: 275, gold: 130 };
    default:
      return { xp: 50, gold: 20 };
  }
}
