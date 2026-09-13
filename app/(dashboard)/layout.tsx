"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNavigation } from "@/components/layout/mobile-nav";
import { RewardListener } from "@/components/rewards/reward-listener";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return null; // or a loading spinner
  }

  return (
    <div className="relative z-10 flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNavigation />
      <RewardListener />
    </div>
  );
}
