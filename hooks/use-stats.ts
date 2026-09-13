"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { PlayerStatsData } from "@/types";

export function useStats() {
  const query = useQuery<{ success: boolean; stats: PlayerStatsData }>({
    queryKey: ["stats"],
    queryFn: () => api.get("/api/stats"),
  });

  return {
    stats: query.data?.stats,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
