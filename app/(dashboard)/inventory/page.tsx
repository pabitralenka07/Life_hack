"use client";

import React from "react";
import Link from "next/link";
import {
  Backpack,
  Store,
  Sparkles,
  Shield,
  Zap,
  Sword,
  Heart,
  Palette,
  PackageOpen,
  CheckCircle2,
} from "lucide-react";
import { useInventory } from "@/hooks/use-inventory";
import { getRarityColor } from "@/lib/utils";
import { playCyberClick } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";

const TOTAL_SLOTS = 12;

export default function InventoryPage() {
  const { inventory, isLoading, isError, toggleEquip, isEquipping, refetch } =
    useInventory();
  const { soundEnabled } = useAppPreferences();

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

  const handleToggleEquip = async (inventoryItemId: string) => {
    if (soundEnabled) playCyberClick(true);
    try {
      await toggleEquip(inventoryItemId);
    } catch (err) {
      console.error("Failed to toggle item equip state:", err);
    }
  };

  const emptySlotCount = Math.max(TOTAL_SLOTS - inventory.length, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            OPERATIVE INVENTORY <Backpack className="w-6 h-6 text-[var(--accent-active)]" />
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Equip active armor, bio-stims, and themes to amplify your character.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--accent-active)] hover:border-[var(--border-active)] hover:bg-[var(--surface-hover)] transition-colors self-start sm:self-auto"
        >
          <Store className="w-4 h-4" />
          Visit Market
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 rounded-2xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-center">
          <p className="text-sm text-[var(--error)] mb-4">
            Could not retrieve operative equipment manifest.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
          >
            Retry Sync
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Real Inventory Items */}
          {inventory.map((invItem) => {
            const item = invItem.shopItem;
            const rarityStyle = getRarityColor(item.rarity);
            const isEquipped = invItem.equipped;

            return (
              <div
                key={invItem.id}
                className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 ${rarityStyle.border} ${rarityStyle.bg} hover:shadow-lg`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-active)]">
                      {getIconComponent(item.icon)}
                    </div>
                    {isEquipped && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--primary-purple)]/20 border border-[var(--accent-active)]/40 text-[var(--accent-active)] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> EQUIPPED
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold font-mono text-[var(--text-primary)] mb-0.5">
                    {item.name}
                  </h3>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    {item.category} • {item.rarity}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  {item.effect && (
                    <div className="text-[10px] font-mono text-[var(--accent-active)] bg-[var(--primary-purple)]/15 px-2 py-0.5 rounded border border-[var(--accent-active)]/20 mb-3">
                      ⚡ {item.effect}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={isEquipping}
                    onClick={() => handleToggleEquip(invItem.id)}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isEquipped
                        ? "bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                        : "btn-primary shadow-sm"
                    }`}
                  >
                    {isEquipped ? "Unequip" : "Equip"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty Inventory Slots */}
          {Array.from({ length: emptySlotCount }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-44 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 flex flex-col items-center justify-center text-[var(--text-muted)]/50 p-4 text-center"
            >
              <PackageOpen className="w-7 h-7 mb-2 stroke-[1.5] text-[var(--text-muted)]/40" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]/50">
                [EMPTY SLOT {inventory.length + idx + 1}]
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
