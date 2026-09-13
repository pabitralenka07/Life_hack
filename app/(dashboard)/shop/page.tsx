"use client";

import React, { useState } from "react";
import {
  Store,
  Coins,
  Shield,
  Sparkles,
  Zap,
  Sword,
  Heart,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { useShopItems } from "@/hooks/use-shop";
import { useCharacter } from "@/hooks/use-character";
import { ShopSkeleton } from "@/components/shared/loading-skeleton";
import { getRarityColor } from "@/lib/utils";
import { playSound, playCyberClick } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";

const SHOP_CATEGORIES = ["ALL", "THEMES", "FRAMES", "MODIFIERS", "EQUIPMENT"];

export default function ShopPage() {
  const { items, isLoading, isError, purchaseItem, isPurchasing, refetch } = useShopItems();
  const { character, refetch: refetchCharacter } = useCharacter();
  const { soundEnabled } = useAppPreferences();

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "ALL") return true;
    return item.category.toUpperCase() === selectedCategory;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Palette":
        return <Palette className="w-6 h-6" />;
      case "Zap":
        return <Zap className="w-6 h-6" />;
      case "Sword":
        return <Sword className="w-6 h-6" />;
      case "Heart":
        return <Heart className="w-6 h-6" />;
      case "Shield":
        return <Shield className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const handlePurchase = async (itemId: string, name: string, price: number) => {
    if (character && character.gold < price) {
      setNotification({
        type: "error",
        message: `Insufficient gold! You need ${price - character.gold} more gold.`,
      });
      return;
    }

    try {
      await purchaseItem(itemId);
      if (soundEnabled) playSound("coin");
      setNotification({
        type: "success",
        message: `Acquired ${name}! Check your inventory or preferences.`,
      });
      refetchCharacter();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to complete transaction.";
      setNotification({ type: "error", message: msg });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            CYBER BLACK MARKET <Store className="w-6 h-6 text-[var(--accent-active)]" />
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Trade hard-earned quest Gold for cybernetic mods, themes, and gear.
          </p>
        </div>

        {/* Gold Balance Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--gold-reward)]/15 border border-[var(--gold-reward)]/40 text-[var(--gold-reward)] font-mono font-bold shadow-lg shadow-[var(--gold-reward)]/10 self-start sm:self-auto">
          <Coins className="w-5 h-5" />
          <span className="text-base">{character?.gold || 0} GOLD AVAILABLE</span>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-[var(--primary-purple)]/15 border-[var(--accent-active)]/50 text-[var(--text-primary)]"
              : "bg-[var(--error)]/10 border-[var(--error)]/50 text-[var(--error)]"
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs underline hover:opacity-80 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SHOP_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              if (soundEnabled) playCyberClick(true);
              setSelectedCategory(cat);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? "btn-primary shadow-md"
                : "bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <ShopSkeleton />
      ) : isError ? (
        <div className="p-8 rounded-2xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-center">
          <p className="text-sm text-[var(--error)] mb-4">
            Could not reach black market terminals. Connection dropped.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
          >
            Retry Market Uplink
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const rarityStyle = getRarityColor(item.rarity);
            const userGold = character?.gold || 0;
            const canAfford = userGold >= item.priceGold;
            const isOwned = item.owned;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${rarityStyle.border} ${rarityStyle.bg} hover:scale-[1.01] hover:shadow-xl`}
              >
                <div>
                  {/* Top Item Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-active)] shadow-inner">
                      {getIconComponent(item.icon)}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${rarityStyle.border} ${rarityStyle.text}`}
                    >
                      {item.rarity}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 font-mono">
                    {item.name}
                  </h3>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] mb-2">
                    {item.category}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Effect Aura */}
                  {item.effect && (
                    <div className="text-[11px] font-mono text-[var(--accent-active)] bg-[var(--primary-purple)]/15 px-2.5 py-1 rounded-lg border border-[var(--accent-active)]/20 mb-4">
                      ⚡ {item.effect}
                    </div>
                  )}
                </div>

                {/* Purchase Button / Price */}
                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 font-mono font-bold text-[var(--gold-reward)] text-sm">
                    <Coins className="w-4 h-4" />
                    <span>{item.priceGold}</span>
                  </div>

                  {isOwned ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[var(--surface-card)] text-[var(--accent-active)] border border-[var(--accent-active)]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACQUIRED
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isPurchasing}
                      onClick={() =>
                        handlePurchase(item.id, item.name, item.priceGold)
                      }
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        canAfford
                          ? "bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:brightness-110 text-[#0B0A12] shadow-md shadow-[#F59E0B]/20 hover:scale-105 active:scale-95"
                          : "bg-[var(--surface-card)] text-[var(--text-muted)]/50 border border-[var(--border-subtle)] cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? "Purchase" : "Need Gold"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
