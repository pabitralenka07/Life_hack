"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { QuestItem } from "@/types";

interface QuestFilters {
  [key: string]: string | number | boolean | undefined;
  attribute?: string;
  category?: string;
  status?: string;
  search?: string;
}

export function useQuests(filters: QuestFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery<QuestItem[]>({
    queryKey: ["quests", filters],
    queryFn: () => api.get("/api/tasks", filters),
  });

  const createMutation = useMutation({
    mutationFn: (newQuest: Partial<QuestItem>) =>
      api.post<{ id: string }>("/api/tasks", newQuest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<QuestItem>) =>
      api.put<{ success: boolean }>(`/api/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/api/tasks/${id}`),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["quests"] });
      const previousQuests = queryClient.getQueryData<QuestItem[]>(["quests", filters]);
      if (previousQuests) {
        queryClient.setQueryData(
          ["quests", filters],
          previousQuests.filter((q) => q.id !== deletedId)
        );
      }
      return { previousQuests };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(["quests", filters], context.previousQuests);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) =>
      api.post<{
        leveledUp: boolean;
        newLevel: number;
        newTotalXP: number;
        xpForNextLevel: number;
        currentStreak: number;
        longestStreak: number;
      }>(`/api/xp/complete-task/${id}`),
    onMutate: async (completedId) => {
      await queryClient.cancelQueries({ queryKey: ["quests"] });
      const previousQuests = queryClient.getQueryData<QuestItem[]>(["quests", filters]);
      if (previousQuests) {
        queryClient.setQueryData(
          ["quests", filters],
          previousQuests.map((q) =>
            q.id === completedId ? { ...q, status: "completed" as const } : q
          )
        );
      }
      return { previousQuests };
    },
    onError: (err, completedId, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(["quests", filters], context.previousQuests);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["character"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  return {
    quests: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createQuest: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateQuest: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteQuest: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    completeQuest: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
  };
}
