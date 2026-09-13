"use client";

import React, { useState } from "react";
import { Plus, Scroll } from "lucide-react";
import { useQuests } from "@/hooks/use-quests";
import { QuestCard } from "@/components/quests/quest-card";
import { QuestFilters } from "@/components/quests/quest-filters";
import { QuestFormModal } from "@/components/quests/quest-form-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { QuestCardSkeleton } from "@/components/shared/loading-skeleton";
import { QuestItem } from "@/types";

export default function QuestsPage() {
  const [selectedAttribute, setSelectedAttribute] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");

  const { quests, isLoading, isError, refetch, createQuest, updateQuest, deleteQuest } =
    useQuests({
      attribute: selectedAttribute !== "ALL" ? selectedAttribute : undefined,
      status: selectedStatus !== "ALL" ? selectedStatus : undefined,
      search: searchQuery.trim() || undefined,
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<QuestItem | null>(null);
  const [deletingId, setDeletingId] = useState<{ id: string; title: string } | null>(null);

  const handleCreateOrUpdate = async (questData: Partial<QuestItem>) => {
    if (editingQuest) {
      await updateQuest({ id: editingQuest.id, ...questData });
    } else {
      await createQuest(questData);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteQuest(deletingId.id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            QUEST DISPATCH BOARD
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Catalog and filter your personal growth operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingQuest(null);
            setIsModalOpen(true);
          }}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Forge Quest
        </button>
      </div>

      {/* Filters */}
      <QuestFilters
        selectedAttribute={selectedAttribute}
        onSelectAttribute={setSelectedAttribute}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Quests Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuestCardSkeleton />
          <QuestCardSkeleton />
          <QuestCardSkeleton />
          <QuestCardSkeleton />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-2xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-center">
          <p className="text-sm text-[var(--error)] mb-4">
            Guild database disconnected while scanning quest board.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          >
            Retry Query
          </button>
        </div>
      ) : quests.length === 0 ? (
        <EmptyState
          icon={Scroll}
          title="NO MATCHING QUESTS FOUND"
          description={
            searchQuery || selectedAttribute !== "ALL"
              ? "No active objectives match your filter criteria. Adjust filters or forge a new quest."
              : "Your quest board is empty. Your journey begins with a single quest."
          }
          actionLabel="Forge First Quest"
          onAction={() => {
            setEditingQuest(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onEdit={(q) => {
                setEditingQuest(q);
                setIsModalOpen(true);
              }}
              onDelete={(id, title) => setDeletingId({ id, title })}
            />
          ))}
        </div>
      )}

      {/* Quest Modal */}
      <QuestFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuest(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingQuest}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="ABORT QUEST PROTOCOL?"
        description={`Are you sure you want to discard "${deletingId?.title}"? Unearned XP and Gold will be permanently lost.`}
        confirmLabel="Abort Quest"
        cancelLabel="Keep Quest"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
