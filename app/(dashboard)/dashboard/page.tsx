"use client";

import React, { useState } from "react";
import { Plus, Scroll, Sparkles } from "lucide-react";
import { useQuests } from "@/hooks/use-quests";
import { QuestCard } from "@/components/quests/quest-card";
import { QuestFormModal } from "@/components/quests/quest-form-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CharacterSummaryWidget } from "@/components/dashboard/character-summary-widget";
import { StreakWidget } from "@/components/dashboard/streak-widget";
import { AttributeMatrixWidget } from "@/components/dashboard/attribute-matrix-widget";
import { QuickCreateQuest } from "@/components/dashboard/quick-create-quest";
import { EmptyState } from "@/components/shared/empty-state";
import { QuestCardSkeleton } from "@/components/shared/loading-skeleton";
import { QuestItem } from "@/types";

export default function DashboardPage() {
  const { quests, isLoading, isError, refetch, createQuest, updateQuest, deleteQuest } =
    useQuests();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<QuestItem | null>(null);
  const [deletingId, setDeletingId] = useState<{ id: string; title: string } | null>(null);

  const activeQuests = quests.filter((q) => q.status === "ACTIVE");
  const completedQuests = quests.filter((q) => q.status === "COMPLETED");

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
      {/* Welcome Banner / Mission Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            MISSION COMMAND <Sparkles className="w-6 h-6 text-[var(--accent-active)]" />
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Real-world productivity protocol. Execute daily objectives to level up.
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

      {/* Main Grid: Center Quest Feed & Right Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Center Quest Feed (8 cols on desktop) */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Quick Create Inline Widget */}
          <QuickCreateQuest
            onOpenFullModal={() => {
              setEditingQuest(null);
              setIsModalOpen(true);
            }}
          />

          {/* Active Quests Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-active)] shadow-sm shadow-[var(--accent-active)]" />
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--text-primary)]">
                  ACTIVE QUESTS ({activeQuests.length})
                </h2>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <QuestCardSkeleton />
                <QuestCardSkeleton />
                <QuestCardSkeleton />
              </div>
            ) : isError ? (
              <div className="p-6 rounded-2xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-center">
                <p className="text-sm text-[var(--error)] mb-3">
                  Failed to synchronize quests with neural mainframe.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-1.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                >
                  Retry Link
                </button>
              </div>
            ) : activeQuests.length === 0 ? (
              <EmptyState
                icon={Scroll}
                title="NO ACTIVE QUESTS LOGGED"
                description="Your quest board is clear. Initiate your next real-world objective to gain XP, gold, and attribute score."
                actionLabel="Forge First Quest"
                onAction={() => {
                  setEditingQuest(null);
                  setIsModalOpen(true);
                }}
              />
            ) : (
              <div className="space-y-4">
                {activeQuests.map((quest) => (
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
          </div>

          {/* Completed Quests Section */}
          {completedQuests.length > 0 && (
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--primary-purple)] shadow-sm shadow-[var(--primary-purple)]" />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  COMPLETED TODAY ({completedQuests.length})
                </h3>
              </div>

              <div className="space-y-4">
                {completedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onDelete={(id, title) => setDeletingId({ id, title })}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Rail: Character Summary, Streak, and Attribute Matrix (4 cols on desktop) */}
        <aside className="lg:col-span-5 xl:col-span-4 space-y-6">
          <CharacterSummaryWidget />
          <StreakWidget />
          <AttributeMatrixWidget />
        </aside>
      </div>

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
        description={`Are you sure you want to permanently discard "${deletingId?.title}"? Unearned XP and Gold will be lost.`}
        confirmLabel="Abort Quest"
        cancelLabel="Keep Quest"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
