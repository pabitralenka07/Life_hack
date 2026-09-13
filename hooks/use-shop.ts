"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ShopItemData } from "@/types";

export function useShopItems() {
  const queryClient = useQueryClient();

  const query = useQuery<{ success: boolean; items: ShopItemData[] }>({
    queryKey: ["shop"],
    queryFn: () => api.get("/api/shop"),
  });

  const purchaseMutation = useMutation({
    mutationFn: (itemId: string) =>
      api.post<{ success: boolean; message: string; newGold: number }>("/api/shop/purchase", {
        itemId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["character"] });
    },
  });

  return {
    items: query.data?.items || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    purchaseItem: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
}
