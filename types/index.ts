export type AttributeName = "STRENGTH" | "INTELLECT" | "VITALITY" | "DISCIPLINE";

export interface AttributeState {
  id: string;
  name: AttributeName;
  value: number;
  todayGains: number;
}

export interface CharacterState {
  id: string;
  userId: string;
  username: string;
  email?: string;
  avatarUrl: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  gold: number;
  streakCurrent: number;
  streakBest: number;
  lastActivityDate: string | null;
  soundEnabled: boolean;
  reducedMotion: boolean;
  attributes: AttributeState[];
}

export type QuestStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type QuestFrequency = "ONCE" | "DAILY" | "WEEKLY";

export interface QuestItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  attribute: AttributeName;
  difficulty: number;
  xpReward: number;
  goldReward: number;
  frequency: QuestFrequency;
  dueDate: string | null;
  status: QuestStatus;
  createdAt: string;
  updatedAt: string;
}

export type ItemRarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type ShopCategory = "FEATURED" | "THEMES" | "BADGES" | "COSMETICS" | "BOOSTERS";

export interface ShopItemData {
  id: string;
  name: string;
  category: ShopCategory;
  rarity: ItemRarity;
  priceGold: number;
  description: string;
  icon: string;
  effect: string | null;
  owned?: boolean;
  equipped?: boolean;
}

export interface InventoryItemData {
  id: string;
  shopItemId: string;
  equipped: boolean;
  acquiredAt: string;
  shopItem: ShopItemData;
}

export interface AchievementData {
  id: string;
  badgeKey: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface QuestCompletionResponse {
  success: boolean;
  quest: QuestItem;
  xpGranted: number;
  goldGranted: number;
  attributeGranted: AttributeName;
  attributeAmount: number;
  newLevel: number;
  leveledUp: boolean;
  levelsGained: number;
  bonusGold: number;
  streakUpdated: boolean;
  newStreak: number;
  character: CharacterState;
}

export interface PlayerStatsData {
  totalQuestsCompleted: number;
  totalXPEarned: number;
  currentLevel: number;
  currentStreak: number;
  bestStreak: number;
  totalGoldEarned: number;
  totalGoldSpent: number;
  attributeDistribution: {
    strength: number;
    intellect: number;
    vitality: number;
    discipline: number;
  };
  recentCompletions: {
    id: string;
    questTitle: string;
    attribute: AttributeName;
    xpGranted: number;
    goldGranted: number;
    completedAt: string;
  }[];
  weeklyActivity: {
    day: string;
    date: string;
    completedCount: number;
    active: boolean;
  }[];
}
