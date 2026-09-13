import React from "react";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNavigation } from "@/components/layout/mobile-nav";
import { RewardListener } from "@/components/rewards/reward-listener";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative z-10 flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Global Reward / Level Up Listener */}
      <RewardListener />
    </div>
  );
}
