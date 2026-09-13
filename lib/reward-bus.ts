"use client";

// Simple lightweight client event bus for quest completion celebrations
export interface RewardEvent {
  xp: number;
  gold: number;
  attribute: string;
  attributeGain: number;
  streak: number;
  leveledUp: boolean;
  newLevel: number;
  bonusGold: number;
}

type RewardCallback = (event: RewardEvent) => void;

const listeners = new Set<RewardCallback>();

export function subscribeRewards(callback: RewardCallback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function broadcastReward(event: RewardEvent) {
  listeners.forEach((callback) => callback(event));
}
