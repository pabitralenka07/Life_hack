"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { QuestItem, QuestCompletionResponse } from "@/types";

interface QuestFilters {
  [key: string]: string | number | boolean | undefined;
  attribute?: string;
  category?: string;
  status?: string;
  search?: string;
}

export function useQuests(filters: QuestFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery<{ success: boolean; quests: QuestItem[] }>({
    queryKey: ["quests", filters],
    queryFn: () => api.get("/api/quests", filters),
  });

  // Create Quest Mutation
  const createMutation = useMutation({
    mutationFn: (newQuest: Partial<QuestItem>) =>
      api.post<{ success: boolean; quest: QuestItem }>("/api/quests", newQuest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  // Update Quest Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<QuestItem>) =>
      api.patch<{ success: boolean; quest: QuestItem }>(`/api/quests/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  // Delete Quest Mutation with optimistic removal
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/api/quests/${id}`),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["quests"] });
      const previousQuests = queryClient.getQueryData<{ success: boolean; quests: QuestItem[] }>([
        "quests",
        filters,
      ]);

      if (previousQuests) {
        queryClient.setQueryData(["quests", filters], {
          ...previousQuests,
          quests: previousQuests.quests.filter((q) => q.id !== deletedId),
        });
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

  // Complete Quest Mutation with Optimistic UI
  const completeMutation = useMutation({
    mutationFn: (id: string) =>
      api.post<QuestCompletionResponse>(`/api/quests/${id}/complete`),
    onMutate: async (completedId) => {
      await queryClient.cancelQueries({ queryKey: ["quests"] });
      await queryClient.cancelQueries({ queryKey: ["character"] });

      const previousQuests = queryClient.getQueryData<{ success: boolean; quests: QuestItem[] }>([
        "quests",
        filters,
      ]);

      if (previousQuests) {
        queryClient.setQueryData(["quests", filters], {
          ...previousQuests,
          quests: previousQuests.quests.map((q) =>
            q.id === completedId ? { ...q, status: "COMPLETED" as const } : q
          ),
        });
      }

      return { previousQuests };
    },
    onError: (err, completedId, context) => {
      if (context?.previousQuests) {
        queryClient.setQueryData(["quests", filters], context.previousQuests);
      }
    },
    onSuccess: (data) => {
      // Authoritatively update character and invalidate queries
      queryClient.setQueryData(["character"], {
        success: true,
        character: data.character,
      });
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  return {
    quests: query.data?.quests || [],
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
