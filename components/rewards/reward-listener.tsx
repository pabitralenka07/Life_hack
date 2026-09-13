"use client";

import React, { useState, useEffect } from "react";
import { subscribeRewards, RewardEvent } from "@/lib/reward-bus";
import { LevelUpModal } from "@/components/rewards/level-up-modal";
import { RewardToast, RewardToastPayload } from "@/components/rewards/reward-toast";

export function RewardListener() {
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    newLevel: number;
    bonusGold: number;
  }>({
    isOpen: false,
    newLevel: 1,
    bonusGold: 0,
  });

  const [toastData, setToastData] = useState<RewardToastPayload | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeRewards((event: RewardEvent) => {
      // 1. Trigger reward toast
      setToastData({
        xp: event.xp,
        gold: event.gold,
        attribute: event.attribute,
        attributeGain: event.attributeGain,
        streak: event.streak,
      });

      // 2. If leveled up, trigger level up celebration modal!
      if (event.leveledUp) {
        setTimeout(() => {
          setLevelUpData({
            isOpen: true,
            newLevel: event.newLevel,
            bonusGold: event.bonusGold,
          });
        }, 500);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <RewardToast
        payload={toastData}
        onDismiss={() => setToastData(null)}
      />
      <LevelUpModal
        isOpen={levelUpData.isOpen}
        newLevel={levelUpData.newLevel}
        bonusGold={levelUpData.bonusGold}
        onClose={() => setLevelUpData((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
