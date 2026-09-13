"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { CharacterState } from "@/types";

export function useCharacter() {
  const queryClient = useQueryClient();

  const query = useQuery<{ success: boolean; character: CharacterState }>({
    queryKey: ["character"],
    queryFn: () => api.get("/api/character"),
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: { avatarUrl?: string; soundEnabled?: boolean; reducedMotion?: boolean }) =>
      api.patch<{ success: boolean; character: CharacterState }>("/api/character", data),
    onSuccess: (data) => {
      queryClient.setQueryData(["character"], data);
    },
  });

  return {
    character: query.data?.character,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updatePreferences: updatePreferencesMutation.mutateAsync,
  };
}
