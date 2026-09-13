"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import TextType from "@/components/shared/TextType";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Brain,
  Sword,
  Heart,
  Target,
  Flame,
  Coins,
  CheckCircle2,
  Zap,
  Radio,
  ChevronRight,
  Terminal,
  Compass,
  Award,
  Clock,
  Play,
  UserCheck,
  Sun,
  Moon,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { playSound } from "@/lib/sound";
import { useAppPreferences } from "@/components/providers";
import SpecularButton from "@/components/shared/SpecularButton";
import ScrollStack, { ScrollStackItem } from "@/components/shared/ScrollStack";
import dynamic from "next/dynamic";

const AntigravityBackground = dynamic(
  () => import("@/components/landing/antigravity-background"),
  { ssr: false }
);

/* ─── 4 Core Disciplines Lore ─── */
const DISCIPLINES = [
  {
    id: "str",
    name: "STRENGTH",
    tagline: "The Iron Vanguard",
    lightColor: "#FF8500",
    darkColor: "#F59E0B",
    icon: Sword,
    lore: "The kinetic armor of the operative. Forged through compound hypertrophy, calisthenics, and physical conditioning. In the life RPG, every heavy set chips away at physical apathy.",
    dailyProtocol: "Weightlifting, sprint intervals, bodyweight endurance",
    passiveBonus: "+15% Stamina threshold against mental burnout",
    quote: "Heavy weight does not negotiate. Neither does the vanguard.",
  },
  {
    id: "int",
    name: "INTELLECT",
    tagline: "The Synapse Matrix",
    lightColor: "#FF8500",
    darkColor: "#A855F7",
    icon: Brain,
    lore: "Neural computational power. Derived from deliberate coding, algorithm mastery, scientific reading, and deep architectural design. Upgrading INTELLECT expands cognitive processing speed.",
    dailyProtocol: "Systems engineering, deep reading, technical problem solving",
    passiveBonus: "+20% XP multiplier on high-complexity heroic quests",
    quote: "To control the machine, one must first master the logic.",
  },
  {
    id: "vit",
    name: "VITALITY",
    tagline: "The Bio-Resonance",
    lightColor: "#D97706",
    darkColor: "#6D28D9",
    icon: Heart,
    lore: "The biological fuel tank. Built through unbroken 8-hour sleep cycles, cellular hydration, clean nutrient fueling, and zone-2 cardiovascular cadences. A high-output operative requires an impenetrable vessel.",
    dailyProtocol: "Circadian sleep alignment, 10K step cadences, clean nutrition",
    passiveBonus: "-30% Fatigue accumulation during multi-hour quest grinds",
    quote: "Without biological resonance, even the sharpest blade shatters.",
  },
  {
    id: "dis",
    name: "DISCIPLINE",
    tagline: "The Focus Citadel",
    lightColor: "#E68A00",
    darkColor: "#FCD34D",
    icon: Target,
    lore: "The keystone of all character scaling. Earned exclusively by honoring commitments when motivation runs dry. Operatives in the Citadel build unbroken streaks and shield their mind against algorithmic dopamine traps.",
    dailyProtocol: "Morning deep work, dopamine fasting, unbroken daily streaks",
    passiveBonus: "Streak Multiplier Shield: doubles gold drops after 7 consecutive days",
    quote: "Motivation is a spark. Discipline is the nuclear reactor.",
  },
];

/* ─── Operative Ascent Chapters ─── */
const CHAPTERS = [
  {
    level: "LVL 01 — 05",
    phase: "ACT I",
    title: "THE NEON INITIATE",
    status: "Awakening",
    desc: "You disconnect from passive consumption. The first quests feel foreign: drinking 2.5L water, 30 minutes of deep focus, a single push session. You forge your first 3-day streak and earn your initial batch of gold.",
    milestone: "First Unbroken Streak Shield & Novice Badge",
  },
  {
    level: "LVL 06 — 15",
    phase: "ACT II",
    title: "THE CYBER VANGUARD",
    status: "Compounding",
    desc: "Habits harden into automated reflexes. You take on 3-Star Heroic Quests — preparing technical certifications, 10K weekend runs, and fasting protocols. The Black Market opens, granting cosmetic frames for your character.",
    milestone: "Access to Epic Equipment & 14-Day Streak Bonus",
  },
  {
    level: "LVL 16 — 30",
    phase: "ACT III",
    title: "THE APEX OPERATIVE",
    status: "Mastery",
    desc: "Your daily routines are an impenetrable fortress. Procrastination is eliminated. You operate across all 4 attributes simultaneously. Colleagues and peers wonder where your limitless reservoir of discipline originates.",
    milestone: "Orbital Spire Clearance & High-Tier Titles",
  },
  {
    level: "LVL 31 — 50",
    phase: "ACT IV",
    title: "THE LIVING LEGEND",
    status: "Transcendence",
    desc: "You have gamified existence so deeply that work, fitness, and study feel like effortless play. You have conquered the Life RPG server rankings and built a life of undeniable real-world mastery.",
    milestone: "Apex Sanctum Access & Eternal Leaderboard Entry",
  },
];

/* ─── Encrypted Field Transmissions ─── */
const TRANSMISSIONS = [
  {
    id: "LOG_0842",
    agent: "Agent Kaelen // Senior Architect",
    level: "LVL 24 INTELLECT",
    timestamp: "Transmission 08:42 UTC",
    text: "Reframing our 4-month cloud infrastructure migration into a 5-Part Dungeon Raid completely altered team psychology. Every deployed PR gave real XP. My Intellect stat went from 14 to 48. I haven't missed a morning sprint in 90 days.",
    attribute: "INTELLECT",
    lightColor: "#FF8500",
    darkColor: "#A855F7",
  },
  {
    id: "LOG_1109",
    agent: "Agent Maya // Endurance Athlete",
    level: "LVL 31 VITALITY",
    timestamp: "Transmission 11:09 UTC",
    text: "Before Life RPG, 5:30 AM winter runs were mental torture. Now? It's a daily vitality harvest. Watching my character's health bar level up and collecting gold for my Black Market gear completely rewired my dopamine loop.",
    attribute: "VITALITY",
    lightColor: "#D97706",
    darkColor: "#6D28D9",
  },
  {
    id: "LOG_0371",
    agent: "Agent Vance // Startup Founder",
    level: "LVL 28 DISCIPLINE",
    timestamp: "Transmission 03:71 UTC",
    text: "Executive dysfunction almost killed my company. Treating client calls and high-pressure investor pitches as 4-Star Boss Encounters gave me the emotional detachment and gamified drive I desperately needed. 42-day streak active.",
    attribute: "DISCIPLINE",
    lightColor: "#FF8500",
    darkColor: "#F59E0B",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppPreferences();
  const isLight = theme === "light";

  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(DISCIPLINES[0]);
  const shouldReduceMotion = useReducedMotion();

  // Interactive Quest Simulator State
  const [simTask, setSimTask] = useState("Implement Cache Invalidation & Stream API");
  const [simAttr, setSimAttr] = useState<"STR" | "INT" | "VIT" | "DIS">("INT");
  const [simDifficulty, setSimDifficulty] = useState<number>(3);
  const [simCompleted, setSimCompleted] = useState(false);

  const getDisciplineColor = (d: (typeof DISCIPLINES)[0]) => (isLight ? d.lightColor : d.darkColor);
  const currentDisciplineColor = getDisciplineColor(selectedDiscipline);

  /* Framer Motion variants */
  const sectionVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut" as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: "easeOut" as const,
      },
    },
  };

  const handleQuickDemoLogin = async () => {
    playSound("click");
    setIsDemoLoading(true);
    try {
      await api.post("/api/auth/login", {
        email: "agent@liferpg.io",
        password: "Password123!",
      });
      router.push("/dashboard");
    } catch {
      router.push("/login");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const calculateRewards = (diff: number) => {
    const xp = diff * 35;
    const gold = diff * 15;
    const stat = diff * 2;
    return { xp, gold, stat };
  };

  const handleSimulateQuest = () => {
    playSound("quest");
    setSimCompleted(true);
    setTimeout(() => {
      playSound("coin");
    }, 300);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col transition-colors duration-300 ${
        isLight
          ? "bg-[#FFF9D8] text-[#241B35] selection:bg-[#FF8500] selection:text-[#FFFFFF]"
          : "bg-[#0B0A12] text-[#F8FAFC] selection:bg-[#6D28D9] selection:text-[#F8FAFC]"
      }`}
    >
      <AntigravityBackground theme={theme} />
      {/* ─── Top Tactical Navbar ─── */}
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
          isLight ? "border-[#E8DEB4] bg-[#FFF9D8]/90" : "border-[#252233] bg-[#0B0A12]/85"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl p-0.5 shadow-md ${
              isLight
                ? "bg-gradient-to-tr from-[#FF8500] via-[#FF8500] to-[#FF8500] shadow-[#FF8500]/25"
                : "bg-gradient-to-tr from-[#6D28D9] via-[#A855F7] to-[#6D28D9] shadow-[#6D28D9]/30"
            }`}
          >
            <div
              className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                isLight ? "bg-[#FFFFFF]" : "bg-[#141224]"
              }`}
            >
              <Sparkles className={`w-5 h-5 ${isLight ? "text-[#FF8500]" : "text-[#F8FAFC]"}`} />
            </div>
          </div>
          <div>
            <span className={`text-lg font-black font-mono tracking-wider ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
              LIFE<span className={isLight ? "text-[#FF8500]" : "text-[#A855F7]"}>//</span>RPG
            </span>
            <div className={`text-[9px] font-mono uppercase tracking-widest hidden sm:block ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
              Neural Life Gamification Protocol
            </div>
          </div>
        </div>

        <nav
          className={`hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-wider ${
            isLight ? "text-[#6B6472]" : "text-[#F8FAFC]/80"
          }`}
        >
          <a href="#prologue" className={`transition-colors font-bold ${isLight ? "hover:text-[#FF8500]" : "hover:text-[#A855F7]"}`}>
            Prologue
          </a>
          <a href="#disciplines" className={`transition-colors font-bold ${isLight ? "hover:text-[#FF8500]" : "hover:text-[#A855F7]"}`}>
            4 Disciplines
          </a>
          <a href="#ascent" className={`transition-colors font-bold ${isLight ? "hover:text-[#FF8500]" : "hover:text-[#A855F7]"}`}>
            The Ascent
          </a>
          <a href="#simulator" className={`transition-colors font-bold ${isLight ? "hover:text-[#FF8500]" : "hover:text-[#A855F7]"}`}>
            Quest Forge
          </a>
          <a href="#transmissions" className={`transition-colors font-bold ${isLight ? "hover:text-[#FF8500]" : "hover:text-[#A855F7]"}`}>
            Transmissions
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={() => {
              playSound("click");
              toggleTheme();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              isLight
                ? "bg-[#FFFFFF] border-[#E8DEB4] text-[#FF8500] hover:bg-[#FFF3C4] hover:border-[#FF8500]"
                : "bg-[#1D1933] border-[#252233] text-[#A855F7] hover:bg-[#252042] hover:border-[#A855F7]/40"
            }`}
            title="Toggle Theme"
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FF8500]" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            onClick={handleQuickDemoLogin}
            disabled={isDemoLoading}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
              isLight
                ? "bg-[#FFFFFF] border-[#E8DEB4] text-[#FF8500] hover:bg-[#FFF3C4] hover:border-[#FF8500]"
                : "bg-[#1D1933] border-[#252233] text-[#A855F7] hover:bg-[#252042] hover:border-[#A855F7]/40"
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`} />
            {isDemoLoading ? "Authenticating..." : "1-Click Demo"}
          </button>

          <Link
            href="/login"
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
              isLight ? "text-[#6B6472] hover:text-[#241B35]" : "text-[#F8FAFC]/70 hover:text-[#F8FAFC]"
            }`}
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 font-black ${
              isLight
                ? "bg-gradient-to-r from-[#FF8500] to-[#FF8500] hover:brightness-105 text-[#FFFFFF] shadow-md shadow-[#FF8500]/30"
                : "bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#6D28D9] hover:brightness-110 text-[#F8FAFC] shadow-md shadow-[#6D28D9]/40"
            }`}
          >
            Begin Journey
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* ─── PROLOGUE: The Awakening (Hero Section) ─── */}
        <motion.section
          id="prologue"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="relative pt-24 pb-28 px-6 max-w-6xl mx-auto text-center space-y-8 overflow-hidden"
        >
          {/* Ambient Glow Orbs */}
          <div
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] rounded-full blur-[140px] pointer-events-none transition-colors duration-300 ${
              isLight ? "bg-[#FF8500]/10" : "bg-[#6D28D9]/15"
            }`}
          />
          <div
            className={`absolute top-1/3 left-1/4 w-[380px] h-[260px] rounded-full blur-[120px] pointer-events-none transition-colors duration-300 ${
              isLight ? "bg-[#FF8500]/08" : "bg-[#A855F7]/12"
            }`}
          />

          <div className="relative z-10 space-y-8">
            {/* Top Mission Pill */}
            <motion.div
              variants={cardVariants}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold animate-pulse transition-colors ${
                isLight
                  ? "bg-[#FFFFFF] border-[#E8DEB4] text-[#FF8500] shadow-sm shadow-[#FF8500]/20"
                  : "bg-[#18152A]/90 border-[#252233] text-[#A855F7] shadow-sm shadow-[#6D28D9]/20"
              }`}
            >
              <Radio className={`w-3.5 h-3.5 animate-spin ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`} />
              <span>TRANSMISSION ACTIVE: YEAR 2084 PROTOCOL</span>
            </motion.div>

            {/* Main Story Headline */}
            <motion.div variants={cardVariants} className="space-y-3 max-w-4xl mx-auto">
              <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tight leading-[1.08] ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                <TextType
                  as="span"
                  text={[
                    "STOP LIVING LIKE AN NPC.",
                    "FORGE YOUR OPERATIVE.",
                    "GAMIFY YOUR REAL LIFE.",
                    "LEVEL UP. EVERY. DAY.",
                  ]}
                  typingSpeed={55}
                  deletingSpeed={28}
                  pauseDuration={2200}
                  loop
                  textColors={isLight ? ["#241B35", "#FF8500", "#D97706", "#FF8500"] : ["#F8FAFC", "#A855F7", "#FCD34D", "#F59E0B"]}
                  cursorCharacter="_"
                  cursorClassName={isLight ? "text-[#FF8500]" : "text-[#A855F7]"}
                  className="block"
                />
              </h1>

              {/* Atmospheric Lore Subtitle */}
              <p className={`text-base sm:text-xl max-w-3xl mx-auto leading-relaxed pt-2 ${isLight ? "text-[#6B6472]" : "text-[#F8FAFC]/85"}`}>
                <TextType
                  as="span"
                  text="In the noisy static of everyday life, your progress evaporates. Heavy lifts uncounted, study sessions invisible, habits unrewarded. LIFE//RPG installs the neural overlay — every real action scales your character, powers your streak shield, and earns hard currency."
                  typingSpeed={18}
                  deletingSpeed={8}
                  pauseDuration={6000}
                  loop
                  showCursor={false}
                  className=""
                />
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={cardVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isLight ? (
                /* ── Light theme: solid orange CTA ── */
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/signup")}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl font-mono text-sm font-black uppercase tracking-wider text-[#FFFFFF] flex items-center justify-center gap-2 cursor-pointer border border-[#E66F00] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9D8]"
                  style={{
                    background: "linear-gradient(135deg, #FF8500 0%, #F59E0B 100%)",
                    boxShadow: "0 10px 24px rgba(255, 133, 0, 0.28)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #E67700 0%, #D97706 100%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #FF8500 0%, #F59E0B 100%)";
                  }}
                >
                  <span>INITIALIZE CHARACTER</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                /* ── Dark theme: WebGL specular button ── */
                <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <SpecularButton
                    size="lg"
                    radius={16}
                    onClick={() => router.push("/signup")}
                    lineColor="#A855F7"
                    baseColor="#6D28D9"
                    textColor="#F8FAFC"
                    intensity={1.2}
                    autoAnimate
                    className="w-full sm:w-auto font-black font-mono"
                  >
                    <span className="flex items-center gap-2">
                      <span>INITIALIZE CHARACTER</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </SpecularButton>
                </motion.div>
              )}

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound("click");
                  document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full sm:w-auto px-7 py-4 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
                  isLight
                    ? "bg-[#FFFFFF] border-[#E8DEB4] text-[#241B35] hover:text-[#FF8500] hover:border-[#FF8500]"
                    : "bg-[#141222] border-[#252233] text-[#F8FAFC] hover:text-[#A855F7] hover:border-[#A855F7]/50"
                }`}
              >
                <Terminal className={`w-4 h-4 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`} />
                <span>FORGE FIRST QUEST</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuickDemoLogin}
                disabled={isDemoLoading}
                className={`w-full sm:w-auto px-7 py-4 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
                  isLight
                    ? "bg-[#FFFFFF] border-[#FF8500]/40 text-[#FF8500] hover:bg-[#FFF3C4]"
                    : "bg-[#1D1933] border-[#6D28D9]/40 text-[#A855F7] hover:bg-[#6D28D9]/20"
                }`}
              >
                <Zap className={`w-4 h-4 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`} />
                <span>{isDemoLoading ? "Authenticating..." : "1-Click Demo"}</span>
              </motion.button>
            </motion.div>

            {/* RPG Vocabulary Translation Ribbon */}
            <motion.div variants={cardVariants} className="pt-10 max-w-4xl mx-auto">
              <div className={`text-[10px] font-mono uppercase tracking-widest mb-2 text-center font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                THE NEURAL TRANSLATION MATRIX // REALITY DECODED
              </div>
              <div
                className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shadow-lg ${
                  isLight ? "bg-[#FFFFFF] border-[#E8DEB4]" : "bg-[#100E1A]/90 border-[#252233]"
                }`}
              >
                <div className="p-2">
                  <div className={`text-[10px] font-mono uppercase ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>Real Task</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>→ RPG Quest</div>
                </div>
                <div className="p-2">
                  <div className={`text-[10px] font-mono uppercase ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>Real Effort</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>→ Experience (XP)</div>
                </div>
                <div className="p-2">
                  <div className={`text-[10px] font-mono uppercase ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>Completion Reward</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>→ Gold & Loot</div>
                </div>
                <div className="p-2">
                  <div className={`text-[10px] font-mono uppercase ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>Daily Routine</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${isLight ? "text-[#D97706]" : "text-[#F59E0B]"}`}>→ Streak Shield</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── ACT I: THE 4 CORE DISCIPLINES ─── */}
        <motion.section
          id="disciplines"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className={`py-20 px-6 max-w-6xl mx-auto border-t transition-colors duration-300 ${
            isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
              ACT I // THE ARCHETYPES
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-mono ${isLight ? "text-[#FF8500]" : "text-[#F8FAFC]"}`}>
              THE 4 CORE DISCIPLINES
            </h2>
            <p className={`text-sm font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
              Every action in the real world channels raw energy into four primary operative stats.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Attribute Selectors */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {DISCIPLINES.map((d) => {
                const Icon = d.icon;
                const isSelected = selectedDiscipline.id === d.id;
                const dColor = getDisciplineColor(d);
                return (
                  <motion.button
                    key={d.id}
                    variants={cardVariants}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playSound("click");
                      setSelectedDiscipline(d);
                    }}
                    className={`text-left p-5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? isLight
                          ? "bg-[#FFFFFF] border-[#FF8500] shadow-lg shadow-[#FF8500]/20"
                          : "bg-[#18152A] border-[#A855F7] shadow-lg shadow-[#6D28D9]/20"
                        : isLight
                        ? "bg-[#FFFFFF] border-[#E8DEB4] hover:border-[#FF8500]/50 hover:bg-[#FFF3C4]"
                        : "bg-[#100E1A]/80 border-[#252233] hover:border-[#A855F7]/40 hover:bg-[#141222]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${dColor}18`,
                          borderColor: `${dColor}50`,
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: dColor }} />
                      </div>
                      <div>
                        <div className={`text-base font-black font-mono tracking-wide ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                          {d.name}
                        </div>
                        <div className={`text-xs font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                          {d.tagline}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        isSelected
                          ? isLight
                            ? "text-[#FF8500] translate-x-1"
                            : "text-[#A855F7] translate-x-1"
                          : isLight
                          ? "text-[#6B6472]/40"
                          : "text-[#A1A1AA]/40"
                      }`}
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* Right Detailed Lore Panel */}
            <motion.div
              variants={cardVariants}
              className={`lg:col-span-7 rounded-3xl border-2 p-7 sm:p-9 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-colors ${
                isLight ? "border-[#E8DEB4] bg-[#FFFFFF]" : "border-[#252233] bg-[#100E1A]/95"
              }`}
            >
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
                style={{ backgroundColor: `${currentDisciplineColor}18` }}
              />

              <div className="space-y-6 relative z-10">
                <div className={`flex items-center justify-between border-b pb-4 ${isLight ? "border-[#E8DEB4]" : "border-[#252233]"}`}>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold" style={{ color: currentDisciplineColor }}>
                    <selectedDiscipline.icon className="w-4 h-4" />
                    <span>NEURAL ARCHETYPE SPECS</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded border font-bold ${
                      isLight ? "bg-[#FFF3C4] border-[#E8DEB4] text-[#6B6472]" : "bg-[#1D1933] border-[#252233] text-[#A1A1AA]"
                    }`}
                  >
                    ACTIVE PROTOCOL
                  </span>
                </div>

                <div>
                  <h3 className={`text-2xl sm:text-3xl font-black font-mono ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                    {selectedDiscipline.tagline.toUpperCase()}
                  </h3>
                  <p className={`text-sm sm:text-base mt-3 leading-relaxed ${isLight ? "text-[#6B6472]" : "text-[#F8FAFC]/90"}`}>
                    {selectedDiscipline.lore}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className={`p-4 rounded-2xl border ${isLight ? "bg-[#FFF9D8] border-[#E8DEB4]" : "bg-[#141222] border-[#252233]"}`}>
                    <div className={`text-[10px] font-mono uppercase font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>Daily Input Sources</div>
                    <div className={`text-xs font-mono font-bold mt-1 ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                      {selectedDiscipline.dailyProtocol}
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isLight ? "bg-[#FFF9D8] border-[#E8DEB4]" : "bg-[#141222] border-[#252233]"}`}>
                    <div className={`text-[10px] font-mono uppercase font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>Passive Character Buff</div>
                    <div className={`text-xs font-mono font-bold mt-1 ${isLight ? "text-[#FF8500]" : "text-[#FCD34D]"}`}>
                      {selectedDiscipline.passiveBonus}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mt-8 pt-4 border-t flex items-center justify-between text-xs font-mono italic relative z-10 ${isLight ? "border-[#E8DEB4] text-[#6B6472]" : "border-[#252233] text-[#A1A1AA]"}`}>
                <span>&ldquo;{selectedDiscipline.quote}&rdquo;</span>
                <span className={`font-bold uppercase not-italic tracking-wider ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
                  +1 {selectedDiscipline.name} PER QUEST
                </span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── ACT II: THE OPERATIVE'S ASCENT (Timeline) ─── */}
        <motion.section
          id="ascent"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className={`py-20 px-6 max-w-6xl mx-auto border-t transition-colors duration-300 ${
            isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
              ACT II // SCALING & LEVELED PROGRESSION
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-mono ${isLight ? "text-[#FF8500]" : "text-[#F8FAFC]"}`}>
              THE OPERATIVE&apos;S ASCENT
            </h2>
            <p className={`text-sm font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
              Progression follows a server-authoritative non-linear power curve: <code>XP = round(100 * Level^1.5)</code>.
            </p>
          </div>

          {/* ScrollStack: stacked chapter cards reveal on scroll */}
          <div className="relative w-full h-[520px]">
            <ScrollStack
              useWindowScroll={false}
              itemDistance={80}
              itemScale={0.04}
              itemStackDistance={24}
              stackPosition="18%"
              scaleEndPosition="8%"
              baseScale={0.88}
              blurAmount={0.5}
              className="h-[520px]"
            >
              {CHAPTERS.map((ch) => (
                <ScrollStackItem
                  key={ch.level}
                  itemClassName={`flex flex-col justify-between h-auto min-h-[280px] ${
                    isLight
                      ? "bg-[#FFFFFF] border border-[#E8DEB4]"
                      : "bg-[#100E1A]/95 border border-[#252233]"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isLight ? "bg-[#FFF9D8] text-[#FF8500] border-[#E8DEB4]" : "bg-[#1D1933] text-[#A855F7] border-[#252233]"
                        }`}
                      >
                        {ch.phase}
                      </span>
                      <span className={`text-xs font-mono font-bold ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>
                        {ch.level}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-2xl font-black font-mono ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                        {ch.title}
                      </h3>
                      <div className={`text-xs font-mono mt-1 font-bold ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
                        Status: {ch.status}
                      </div>
                    </div>

                    <p className={`text-sm leading-relaxed font-sans ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                      {ch.desc}
                    </p>
                  </div>

                  <div className={`mt-6 pt-4 border-t ${isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"}`}>
                    <div className={`text-[10px] font-mono uppercase font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>Chapter Unlock</div>
                    <div className={`text-sm font-mono font-bold mt-0.5 ${isLight ? "text-[#FF8500]" : "text-[#FCD34D]"}`}>
                      {ch.milestone}
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </motion.section>

        {/* ─── ACT III: THE LIVE SYSTEM SIMULATION ─── */}
        <motion.section
          id="preview-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className={`py-20 px-6 max-w-6xl mx-auto border-t transition-colors duration-300 ${
            isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
              ACT III // HUD SIMULATION
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-mono ${isLight ? "text-[#FF8500]" : "text-[#F8FAFC]"}`}>
              LIVE OPERATIVE INTERFACE
            </h2>
            <p className={`text-sm font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
              Reads as an authentic high-tech RPG terminal, never a generic SaaS spreadsheet.
            </p>
          </div>

          {/* Game Preview Frame */}
          <motion.div
            variants={cardVariants}
            className={`rounded-3xl border-2 p-5 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md transition-colors ${
              isLight ? "border-[#E8DEB4] bg-[#FFFFFF] shadow-[#FF8500]/15" : "border-[#252233] bg-[#100E1A]/95 shadow-[#6D28D9]/20"
            }`}
          >
            {/* Top Mock Game Header */}
            <div className={`flex flex-wrap items-center justify-between gap-4 pb-5 border-b mb-6 ${isLight ? "border-[#E8DEB4]" : "border-[#252233]"}`}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl p-0.5 shadow-md ${
                    isLight
                      ? "bg-gradient-to-tr from-[#FF8500] via-[#FF8500] to-[#FF8500] shadow-[#FF8500]/25"
                      : "bg-gradient-to-tr from-[#6D28D9] via-[#A855F7] to-[#F59E0B] shadow-[#6D28D9]/30"
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-[14px] flex items-center justify-center font-mono font-black text-lg ${
                      isLight ? "bg-[#FFF9D8] text-[#FF8500]" : "bg-[#161326] text-[#F8FAFC]"
                    }`}
                  >
                    V
                  </div>
                </div>
                <div>
                  <div className={`text-sm font-bold font-mono flex items-center gap-2 ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                    OPERATIVE V_CYBER
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-black ${
                        isLight
                          ? "bg-gradient-to-r from-[#FF8500] to-[#FF8500] text-[#FFFFFF]"
                          : "bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#0B0A12]"
                      }`}
                    >
                      LVL 17
                    </span>
                  </div>
                  <div className={`text-xs font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                    850 / 1,000 XP (85% to Next Tier)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div
                  className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1 ${
                    isLight
                      ? "bg-[#FFF3C4] border-[#E8DEB4] text-[#FF8500]"
                      : "bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]"
                  }`}
                >
                  <Flame className={`w-4 h-4 inline ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`} /> 12-day streak
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1 ${
                    isLight
                      ? "bg-[#FFF3C4] border-[#E8DEB4] text-[#FF8500]"
                      : "bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]"
                  }`}
                >
                  <Coins className={`w-4 h-4 inline ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`} /> 1,240 gold
                </div>
              </div>
            </div>

            {/* Mock Quests Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Intellect Quest */}
              <div
                className={`rounded-2xl border p-5 shadow-sm ${
                  isLight ? "border-[#E8DEB4] bg-[#FFF9D8]" : "border-[#6D28D9]/50 bg-gradient-to-b from-[#18152A] to-[#141222]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
                    <Brain className={`w-4 h-4 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`} /> INTELLECT • Coding
                  </span>
                  <span className={`text-xs ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>★★★☆☆</span>
                </div>
                <h4 className={`text-base font-bold mb-1 ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                  Master React Server Components
                </h4>
                <p className={`text-xs mb-3 ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                  Implement cache boundaries, data streaming, and edge routes.
                </p>
                <div className={`flex items-center justify-between pt-2 border-t ${isLight ? "border-[#E8DEB4]" : "border-[#252233]"}`}>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={`font-bold ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>+75 XP</span>
                    <span className={`font-bold ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>+25 Gold</span>
                    <span className={`font-bold ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>+5 INT</span>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase ${
                      isLight ? "bg-[#FF8500] text-[#FFFFFF]" : "bg-[#6D28D9] text-[#F8FAFC]"
                    }`}
                  >
                    Active Quest
                  </span>
                </div>
              </div>

              {/* Strength Quest */}
              <div
                className={`rounded-2xl border p-5 shadow-sm ${
                  isLight ? "border-[#E8DEB4] bg-[#FFF9D8]" : "border-[#6D28D9]/50 bg-gradient-to-b from-[#18152A] to-[#141222]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>
                    <Sword className={`w-4 h-4 ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`} /> STRENGTH • Fitness
                  </span>
                  <span className={`text-xs ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>★★★★☆</span>
                </div>
                <h4 className={`text-base font-bold mb-1 ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
                  Heavy Squats Protocol (5x5)
                </h4>
                <p className={`text-xs mb-3 ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                  Full depth compound leg session with progressive overload.
                </p>
                <div className={`flex items-center justify-between pt-2 border-t ${isLight ? "border-[#E8DEB4]" : "border-[#252233]"}`}>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={`font-bold ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>+120 XP</span>
                    <span className={`font-bold ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>+45 Gold</span>
                    <span className={`font-bold ${isLight ? "text-[#241B35]" : "text-[#F59E0B]"}`}>+5 STR</span>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase ${
                      isLight ? "bg-[#FF8500] text-[#FFFFFF]" : "bg-[#6D28D9] text-[#F8FAFC]"
                    }`}
                  >
                    Active Quest
                  </span>
                </div>
              </div>
            </div>

            {/* Mock Attributes Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-xl border text-center ${isLight ? "bg-[#FFF9D8] border-[#E8DEB4]" : "bg-[#141222] border-[#252233]"}`}>
                <div className={`text-xs font-mono font-bold ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>⚔ STRENGTH</div>
                <div className={`text-lg font-mono font-bold ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>32</div>
              </div>
              <div className={`p-3 rounded-xl border text-center ${isLight ? "bg-[#FFF9D8] border-[#E8DEB4]" : "bg-[#141222] border-[#252233]"}`}>
                <div className={`text-xs font-mono font-bold ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>🧠 INTELLECT</div>
                <div className={`text-lg font-mono font-bold ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>48</div>
              </div>
              <div className={`p-3 rounded-xl border text-center ${isLight ? "bg-[#FFF9D8] border-[#E8DEB4]" : "bg-[#141222] border-[#252233]"}`}>
                <div className={`text-xs font-mono font-bold ${isLight ? "text-[#D97706]" : "text-[#A855F7]"}`}>❤️ VITALITY</div>
                <div className={`text-lg font-mono font-bold ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>28</div>
              </div>
              <div className={`p-3 rounded-xl border text-center ${isLight ? "bg-[#FFF9D8] border-[#E8DEB4]" : "bg-[#141222] border-[#252233]"}`}>
                <div className={`text-xs font-mono font-bold ${isLight ? "text-[#E68A00]" : "text-[#FCD34D]"}`}>🎯 DISCIPLINE</div>
                <div className={`text-lg font-mono font-bold ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>39</div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ─── ACT IV: INTERACTIVE QUEST FORGE SIMULATOR ─── */}
        <motion.section
          id="simulator"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className={`py-20 px-6 max-w-6xl mx-auto border-t transition-colors duration-300 ${
            isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
              ACT IV // THE FORGE SIMULATOR
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-mono ${isLight ? "text-[#FF8500]" : "text-[#F8FAFC]"}`}>
              TRY FORGING A REAL-LIFE QUEST
            </h2>
            <p className={`text-sm font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
              Type any real task below. Select its attribute & difficulty to see how the RPG engine calculates rewards.
            </p>
          </div>

          <motion.div
            variants={cardVariants}
            className={`max-w-3xl mx-auto p-6 sm:p-9 rounded-3xl border-2 shadow-2xl space-y-6 transition-colors ${
              isLight ? "border-[#E8DEB4] bg-[#FFFFFF]" : "border-[#252233] bg-[#100E1A]/95"
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 ${isLight ? "border-[#E8DEB4]" : "border-[#252233]"}`}>
              <div className={`flex items-center gap-2 font-mono text-xs font-bold ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
                <Terminal className={`w-4 h-4 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`} />
                <span>QUEST_GENERATOR_V3.8</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>PREVIEW MODE</span>
            </div>

            {/* Task Name Input */}
            <div className="space-y-2">
              <label className={`text-xs font-mono uppercase font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                Real-World Objective
              </label>
              <input
                type="text"
                value={simTask}
                onChange={(e) => {
                  setSimTask(e.target.value);
                  setSimCompleted(false);
                }}
                className={`w-full px-4 py-3 rounded-xl border font-mono text-sm focus:outline-none transition-colors ${
                  isLight
                    ? "bg-[#FFF9D8] border-[#E8DEB4] text-[#241B35] focus:border-[#FF8500]"
                    : "bg-[#18152A] border-[#252233] text-[#F8FAFC] focus:border-[#A855F7]"
                }`}
                placeholder="e.g. Read 40 pages of Distributed Systems..."
              />
            </div>

            {/* Attribute & Difficulty Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                  Target Attribute
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["STR", "INT", "VIT", "DIS"] as const).map((attr) => (
                    <button
                      key={attr}
                      type="button"
                      onClick={() => {
                        playSound("click");
                        setSimAttr(attr);
                        setSimCompleted(false);
                      }}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        simAttr === attr
                          ? isLight
                            ? "bg-[#FF8500] text-[#FFFFFF] border-[#FF8500] shadow-md shadow-[#FF8500]/25"
                            : "bg-[#6D28D9] text-[#F8FAFC] border-[#A855F7] shadow-md shadow-[#6D28D9]/30"
                          : isLight
                          ? "bg-[#FFF9D8] text-[#6B6472] border-[#E8DEB4] hover:text-[#241B35]"
                          : "bg-[#141222] text-[#A1A1AA] border-[#252233] hover:text-[#F8FAFC]"
                      }`}
                    >
                      {attr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                  Quest Difficulty ({simDifficulty} Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        playSound("click");
                        setSimDifficulty(star);
                        setSimCompleted(false);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        simDifficulty >= star
                          ? isLight
                            ? "bg-[#FF8500] text-[#FFFFFF] border-[#FF8500] shadow-sm shadow-[#FF8500]/25"
                            : "bg-[#F59E0B] text-[#0B0A12] border-[#F59E0B] shadow-sm shadow-[#F59E0B]/30"
                          : isLight
                          ? "bg-[#FFF9D8] text-[#6B6472] border-[#E8DEB4]"
                          : "bg-[#141222] text-[#A1A1AA] border-[#252233]"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Yield Box */}
            {(() => {
              const { xp, gold, stat } = calculateRewards(simDifficulty);
              return (
                <div
                  className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
                    isLight ? "bg-[#FFF3C4] border-[#E8DEB4]" : "bg-[#141222] border-[#252233]"
                  }`}
                >
                  <div>
                    <div className={`text-[10px] font-mono uppercase font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
                      Calculated Reward Yield
                    </div>
                    <div className="flex items-center gap-3 text-sm font-mono mt-1">
                      <span className={`font-bold ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>+{xp} XP</span>
                      <span className={`font-bold ${isLight ? "text-[#FF8500]" : "text-[#F59E0B]"}`}>+{gold} Gold</span>
                      <span className={`font-bold ${isLight ? "text-[#241B35]" : "text-[#FCD34D]"}`}>
                        +{stat} {simAttr}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSimulateQuest}
                    className={`px-6 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      isLight
                        ? "bg-gradient-to-r from-[#FF8500] via-[#FF8500] to-[#FF8500] text-[#FFFFFF] hover:brightness-105 shadow-md shadow-[#FF8500]/30"
                        : "bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#6D28D9] text-[#F8FAFC] hover:brightness-110 shadow-md shadow-[#6D28D9]/30"
                    }`}
                  >
                    {simCompleted ? "✓ REWARDS COLLECTED!" : "SIMULATE COMPLETION"}
                  </motion.button>
                </div>
              );
            })()}
          </motion.div>
        </motion.section>

        {/* ─── ACT V: ENCRYPTED FIELD TRANSMISSIONS ─── */}
        <motion.section
          id="transmissions"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className={`py-20 px-6 max-w-6xl mx-auto border-t transition-colors duration-300 ${
            isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>
              ACT V // FIELD ARCHIVES
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-mono ${isLight ? "text-[#FF8500]" : "text-[#F8FAFC]"}`}>
              OPERATIVE TRANSMISSIONS
            </h2>
            <p className={`text-sm font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>
              Intercepted log files from real individuals operating under the Life RPG protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRANSMISSIONS.map((t) => (
              <motion.div
                key={t.id}
                variants={cardVariants}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-colors shadow-xl ${
                  isLight
                    ? "border-[#E8DEB4] bg-[#FFFFFF] hover:border-[#FF8500] hover:bg-[#FFF3C4]"
                    : "border-[#252233] bg-[#100E1A]/85 hover:border-[#A855F7]/50 hover:bg-[#141222]"
                }`}
              >
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"}`}>
                    <span className={`text-[10px] font-mono font-bold ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>{t.id}</span>
                    <span className={`text-[10px] font-mono font-bold ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`}>{t.timestamp}</span>
                  </div>

                  <p className={`text-xs leading-relaxed font-sans italic ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]/90"}`}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className={`mt-6 pt-3 border-t flex items-center justify-between ${isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"}`}>
                  <div>
                    <div className={`text-xs font-mono font-bold ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>{t.agent}</div>
                    <div className={`text-[10px] font-mono ${isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}`}>{t.level}</div>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: isLight ? t.lightColor : t.darkColor }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── EPILOGUE: THE OPERATIVE OATH ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className={`py-24 px-6 max-w-4xl mx-auto text-center space-y-8 border-t transition-colors duration-300 ${
            isLight ? "border-[#E8DEB4]" : "border-[#252233]/60"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl p-0.5 mx-auto shadow-xl ${
              isLight
                ? "bg-gradient-to-tr from-[#FF8500] via-[#FF8500] to-[#FF8500] shadow-[#FF8500]/25"
                : "bg-gradient-to-tr from-[#6D28D9] via-[#A855F7] to-[#6D28D9] shadow-[#6D28D9]/30"
            }`}
          >
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLight ? "bg-[#FFF9D8]" : "bg-[#161326]"}`}>
              <Compass className={`w-7 h-7 ${isLight ? "text-[#FF8500]" : "text-[#A855F7]"}`} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className={`text-3xl sm:text-5xl font-black font-mono tracking-tight ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
              WILL YOU REMAIN AN NPC?
            </h2>
            <p className={`text-base max-w-2xl mx-auto leading-relaxed ${isLight ? "text-[#6B6472]" : "text-[#F8FAFC]/85"}`}>
              Tomorrow will arrive whether you measure it or not. You can close this tab and return to the unquantified
              loop... Or initialize your operative clearance and begin accumulating XP today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-mono text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isLight
                    ? "bg-gradient-to-r from-[#FF8500] via-[#FF8500] to-[#FF8500] text-[#FFFFFF] shadow-xl shadow-[#FF8500]/30 hover:brightness-105"
                    : "bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#6D28D9] text-[#F8FAFC] shadow-xl shadow-[#6D28D9]/40 hover:brightness-110"
                }`}
              >
                <span>ACCEPT OPERATIVE OATH</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleQuickDemoLogin}
              disabled={isDemoLoading}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider transition-colors border ${
                isLight
                  ? "bg-[#FFFFFF] border-[#E8DEB4] text-[#241B35] hover:text-[#FF8500] hover:border-[#FF8500]"
                  : "bg-[#1D1933] border-[#252233] text-[#A855F7] hover:bg-[#252042]"
              }`}
            >
              <span>Instant Guest Clearance</span>
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* ─── Footer ─── */}
      <footer
        className={`relative z-10 border-t py-10 px-6 text-center text-xs font-mono space-y-2 transition-colors duration-300 ${
          isLight ? "border-[#E8DEB4] bg-[#FFFDF0] text-[#6B6472]" : "border-[#252233] bg-[#07060B] text-[#A1A1AA]"
        }`}
      >
        <div className={`flex items-center justify-center gap-4 text-[11px] uppercase tracking-wider font-bold ${isLight ? "text-[#241B35]" : "text-[#F8FAFC]"}`}>
          <span>Life RPG // OS v2.4</span>
          <span>•</span>
          <span>SQLite Engine</span>
          <span>•</span>
          <span>Zero Server Lag</span>
        </div>
        <p className={isLight ? "text-[#6B6472]" : "text-[#A1A1AA]"}>
          Designed for operatives seeking real-world mastery through gamified cognitive protocols.
        </p>
      </footer>
    </div>
  );
}
