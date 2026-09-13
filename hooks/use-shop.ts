"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  type: string;
  priceGold: number;
  category: string;
  rarity: string;
  owned: boolean;
  icon: string;
  description: string;
  effect: string;
}

export function useShopItems() {
  const queryClient = useQueryClient();

  const query = useQuery<Record<string, Partial<ShopItem>>>({
    queryKey: ["shop"],
    queryFn: () => api.get("/api/shop/items"),
  });

  const items: ShopItem[] = query.data
    ? Object.entries(query.data).map(([id, item]) => ({
        id,
        name: item.name || "Unknown Item",
        cost: item.cost || 0,
        type: item.type || "item",
        priceGold: item.priceGold ?? item.cost ?? 0,
        category: item.category ?? (item.type ? item.type.toUpperCase() : "EQUIPMENT"),
        rarity: item.rarity ?? "COMMON",
        owned: item.owned ?? false,
        icon: item.icon ?? "Sparkles",
        description: item.description ?? `${item.name || "Item"} (${item.type || "utility"})`,
        effect: item.effect ?? "",
      }))
    : [];

  const purchaseMutation = useMutation({
    mutationFn: (itemId: string) =>
      api.post<{ success: boolean; item: ShopItem; remainingCurrency: number }>(
        `/api/shop/buy/${itemId}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["character"] });
    },
  });

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    purchaseItem: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
}
