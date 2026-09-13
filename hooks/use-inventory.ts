"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { InventoryItemData } from "@/types";

export function useInventory() {
  const queryClient = useQueryClient();

  const query = useQuery<{ success: boolean; inventory: InventoryItemData[] }>({
    queryKey: ["inventory"],
    queryFn: () => api.get("/api/inventory"),
  });

  const equipMutation = useMutation({
    mutationFn: (inventoryItemId: string) =>
      api.post<{ success: boolean; item: InventoryItemData; message: string }>(
        "/api/inventory/equip",
        { inventoryItemId }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      queryClient.invalidateQueries({ queryKey: ["character"] });
    },
  });

  return {
    inventory: query.data?.inventory || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    toggleEquip: equipMutation.mutateAsync,
    isEquipping: equipMutation.isPending,
  };
}
