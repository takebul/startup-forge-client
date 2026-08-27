"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Search,
  Users,
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
  Code2,
  Clock,
  Layers,
  Award,
  Cpu,
  Palette,
  Check,
  ArrowUpRight,
} from "lucide-react";

// =============================================================================
// PIPELINE STEP DEFINITIONS WITH INTERACTIVE SIMULATION PROPS
// =============================================================================
const PIPELINE_STEPS = [
  {
    id: "specs",
    stepNumber: "01",
    tagline: "Venture Architecture",
    title: "Define Specs & Equity Terms",
    description:
      "Craft high-converting role postings with transparent equity splits, tech stack prerequisites, and weekly commitment expectations.",
    icon: Lightbulb,
    badge: "Smart Builder",
    accentColor: "violet",
  },
  {
    id: "matching",
    stepNumber: "02",
    tagline: "Graph Synergy",
    title: "Algorithmic Talent Pairing",
    description:
      "Our talent graph filters 8,500+ builders to surface developers, designers, and marketers whose verified skills fit your exact roadmap.",
    icon: Search,
    badge: "98% Fit Score",
    accentColor: "indigo",
  },
  {
    id: "pipeline",
    stepNumber: "03",
    tagline: "Streamlined Review",
    title: "1-Click Evaluation & Onboarding",
    description:
      "Review structured candidate pitches complete with live GitHub repos, portfolio links, and skill verifications without recruiter delays.",
    icon: Users,
    badge: "Zero Spam",
    accentColor: "purple",
  },
  {
    id: "launch",
    stepNumber: "04",
    tagline: "Execution Speed",
    title: "Milestone Tracking & Launch",
    description:
      "Onboard co-builders, establish clear delivery milestones, and accelerate from napkin sketch to venture-backed product launch.",
    icon: Rocket,
    badge: "48h Velocity",
    accentColor: "emerald",
  },
];

// Interactive Role Calculator Profiles
const ROLE_CALCULATOR_DATA = {
  ai: {
    title: "AI / Machine Learning Engineer",
    icon: Cpu,
    avgEquity: "8% – 15%",
    timeToTeam: "36 Hours",
    activeHiring: "140+ Startups",
    primarySkills: ["PyTorch", "Python", "LLMs", "LangChain", "Vector DBs"],
    hotDomains: ["Autonomous Agents", "BioTech", "Enterprise Copilots"],
  },
  fullstack: {
    title: "Full-Stack Architect",
    icon: Code2,
    avgEquity: "6% – 12%",
    timeToTeam: "48 Hours",
    activeHiring: "220+ Startups",
    primarySkills: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Tailwind",
    ],
    hotDomains: ["SaaS Platforms", "FinTech", "DevTools"],
  },
  design: {
    title: "Founding Product Designer",
    icon: Palette,
    avgEquity: "5% – 10%",
    timeToTeam: "48 Hours",
    activeHiring: "95+ Startups",
    primarySkills: [
      "Figma",
      "Design Systems",
      "UI/UX",
      "Prototyping",
      "Design Ops",
    ],
    hotDomains: ["Consumer Apps", "Web3", "HealthTech"],
  },
  growth: {
    title: "Growth & Product Strategist",
    icon: TrendingUp,
    avgEquity: "4% – 8%",
    timeToTeam: "72 Hours",
    activeHiring: "80+ Startups",
    primarySkills: [
      "PLG",
      "Analytics",
      "SEO",
      "User Acquisition",
      "Conversion Ops",
    ],
    hotDomains: ["B2B Marketplaces", "EdTech", "Creator Economy"],
  },
};

const WhyJoinStartupForge = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState("ai");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play step cycling with hover-pause
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeStep = PIPELINE_STEPS[activeStepIndex];
  const activeRoleData = ROLE_CALCULATOR_DATA[selectedRole];

  return (
    <section className="relative overflow-hidden py-10 md:py-12 lg:py-14 text-slate-900 transition-colors duration-300 dark:text-slate-100 font-sans">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl space-y-10 md:space-y-12">
        {/* ===================================================================
            1. SECTION HEADER
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-violet-50 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            <span>The Venture Assembly Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Why Visionary Teams Choose{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
              StartupForge
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed max-w-2xl mx-auto px-2">
            Traditional hiring platforms were built for corporations.
            StartupForge is purpose-built to assemble early-stage venture teams
            with speed, transparency, and shared ownership.
          </p>
        </motion.div>

        {/* ===================================================================
            2. INTERACTIVE VENTURE PIPELINE SIMULATOR (MASTER BENTO STAGE)
            =================================================================== */}
        <div
          className="rounded-3xl border border-slate-200/90 bg-white/90 p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-[#0B1120]/90"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Interactive Step Navigator */}
            <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Interactive Pipeline
                </span>
                <span className="text-[11px] font-mono text-violet-600 dark:text-violet-400 font-semibold">
                  Step {activeStepIndex + 1} of {PIPELINE_STEPS.length}
                </span>
              </div>

              <div className="space-y-2">
                {PIPELINE_STEPS.map((step, idx) => {
                  const isActive = activeStepIndex === idx;
                  const StepIcon = step.icon;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      className={`group w-full text-left rounded-2xl border p-3 sm:p-4 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-violet-500/60 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent dark:border-violet-500/50 dark:from-violet-950/40 shadow-xs scale-[1.01] sm:scale-[1.02]"
                          : "border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3.5">
                        <div
                          className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${
                            isActive
                              ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/25"
                              : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 truncate">
                              {step.stepNumber} • {step.tagline}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold shrink-0 ${
                                isActive
                                  ? "bg-violet-600 text-white dark:bg-violet-500"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {step.badge}
                            </span>
                          </div>

                          <h4
                            className={`text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 transition-colors truncate ${
                              isActive
                                ? "text-violet-700 dark:text-violet-300"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {step.title}
                          </h4>

                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Interactive Interactive Simulation Screen */}
            <div className="lg:col-span-7">
              <div className="relative min-h-[340px] sm:min-h-[380px] rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 via-white to-slate-100/90 p-4 sm:p-6 md:p-7 shadow-inner dark:border-slate-800 dark:from-[#060C1A] dark:via-slate-900/90 dark:to-[#0B1120] flex flex-col justify-center overflow-hidden">
                {/* Decorative background glow */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15" />

                <AnimatePresence mode="wait">
                  {/* SIMULATION 1: SPEC BUILDER */}
                  {activeStepIndex === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3.5 sm:space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5 sm:pb-3">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                          <span className="ml-1 sm:ml-2 text-[11px] sm:text-xs font-mono font-bold text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">
                            Opportunity_Spec.jsx
                          </span>
                        </div>
                        <span className="rounded-full bg-violet-100 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 shrink-0">
                          LIVE DRAFT
                        </span>
                      </div>

                      {/* Mockup Card Body */}
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 uppercase">
                              Target Role
                            </span>
                            <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                              Founding AI &amp; Infrastructure Engineer
                            </h5>
                          </div>
                          <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 self-start sm:self-auto shrink-0">
                            12% – 18% Equity
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="rounded-xl bg-slate-50 p-2 sm:p-2.5 dark:bg-slate-800/60">
                            <span className="text-slate-400 text-[9px] sm:text-[10px]">
                              Commitment
                            </span>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs truncate">
                              Part-Time (15h/wk)
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-2 sm:p-2.5 dark:bg-slate-800/60">
                            <span className="text-slate-400 text-[9px] sm:text-[10px]">
                              Location
                            </span>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs truncate">
                              Remote (Global)
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase">
                            Required Tech Stack
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-[11px]">
                            {[
                              "PyTorch",
                              "Next.js 15",
                              "LangChain",
                              "PostgreSQL",
                            ].map((tag) => (
                              <span
                                key={tag}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          <span>Ready for 8,500+ builders</span>
                        </span>
                        <span className="font-semibold text-slate-400">
                          Match Speed: ~2 mins
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* SIMULATION 2: TALENT GRAPH SYNERGY */}
                  {activeStepIndex === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                          <span>AI Talent Matches (3 Verified)</span>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                          99.2% MAX FIT
                        </span>
                      </div>

                      {/* Candidate 1 */}
                      <div className="rounded-2xl border border-violet-200 bg-white p-3.5 sm:p-4 shadow-xs dark:border-violet-500/30 dark:bg-slate-900 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold font-mono text-xs sm:text-sm shrink-0">
                              AR
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h6 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                  Alex Rivera
                                </h6>
                                <span className="rounded-full bg-violet-100 px-1.5 py-0.2 text-[9px] font-mono font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                                  Ex-Stripe AI
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                6 yrs exp • Stanford CS
                              </p>
                            </div>
                          </div>

                          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] sm:text-xs font-mono font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 shrink-0">
                            99% Match
                          </span>
                        </div>

                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-1 pt-0.5 font-mono text-[10px]">
                          {[
                            "PyTorch",
                            "Next.js 15",
                            "Vector DBs",
                            "LangChain",
                          ].map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-slate-50 border border-slate-200/80 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Candidate 2 */}
                      <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/70 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center text-white font-bold font-mono text-xs sm:text-sm shrink-0">
                              ER
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h6 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                  Elena Rostova
                                </h6>
                                <span className="rounded-full bg-sky-100 px-1.5 py-0.2 text-[9px] font-mono font-bold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                                  ML Fellow
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                LLM Fine-Tuning Specialist
                              </p>
                            </div>
                          </div>

                          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] sm:text-xs font-mono font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 shrink-0">
                            97% Match
                          </span>
                        </div>

                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-1 pt-0.5 font-mono text-[10px]">
                          {[
                            "Python",
                            "CUDA",
                            "LLaMA 3",
                            "Distributed Training",
                          ].map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-slate-50 border border-slate-200/80 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SIMULATION 3: 1-CLICK REVIEW & PROPOSAL */}
                  {activeStepIndex === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
                            Application Pitch Review
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-mono text-slate-400 shrink-0 ml-2">
                          12 mins ago
                        </span>
                      </div>

                      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 md:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                        {/* Candidate Identity Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-violet-600 text-white font-bold font-mono text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm shadow-violet-600/30">
                              AR
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h6 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                  Alex Rivera
                                </h6>
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                  Verified Fit
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                                Senior AI Systems Engineer
                              </p>
                            </div>
                          </div>

                          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 self-start sm:self-auto shrink-0 border border-violet-200/60 dark:border-violet-500/20">
                            15h/wk Available
                          </span>
                        </div>

                        {/* Pitch Message Bubble */}
                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-2.5 sm:p-3 dark:border-slate-800 dark:bg-slate-800/50">
                          <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed italic">
                            &ldquo;I built an agentic evaluation framework and
                            want to co-found your AI stack. Ready to commit
                            15h/week.&rdquo;
                          </p>
                        </div>

                        {/* Candidate Links */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                            <span>alexrivera.dev</span>
                            <ArrowUpRight className="h-3 w-3 text-slate-400" />
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                            <span>github.com/arivera</span>
                            <ArrowUpRight className="h-3 w-3 text-slate-400" />
                          </span>
                        </div>

                        {/* Interactive Decision Actions */}
                        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2 sm:py-2.5 px-3 text-xs font-mono font-bold text-white shadow-sm shadow-violet-600/20 hover:bg-violet-700 transition-colors cursor-pointer text-center"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept Proposal</span>
                          </button>
                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300/80 bg-slate-50 py-2 sm:py-2.5 px-3 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer text-center"
                          >
                            <span>Chat on Platform</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SIMULATION 4: MILESTONE TRACKING & LAUNCH */}
                  {activeStepIndex === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 sm:space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5 sm:pb-3">
                        <div className="flex items-center gap-1.5">
                          <Rocket className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
                            Milestones &amp; Launch
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 shrink-0">
                          ON TRACK
                        </span>
                      </div>

                      <div className="space-y-2 font-mono">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 sm:p-3 dark:border-emerald-500/20 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-emerald-900 dark:text-emerald-200 font-bold min-w-0">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">
                              01: Core Spec &amp; Onboarding
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold shrink-0 self-end sm:self-auto">
                            100% DONE
                          </span>
                        </div>

                        <div className="rounded-xl border border-violet-200 bg-violet-50/80 p-2.5 sm:p-3 dark:border-violet-500/20 dark:bg-violet-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-violet-900 dark:text-violet-200 font-bold min-w-0">
                            <Clock className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                            <span className="truncate">
                              02: Alpha MVP Deployment
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-violet-600 font-bold shrink-0 self-end sm:self-auto">
                            IN PROGRESS (84%)
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3 dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 opacity-75">
                          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium min-w-0">
                            <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              03: Public Launch &amp; Pitch
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0 self-end sm:self-auto">
                            UPCOMING
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. DYNAMIC ROLE & TALENT SYNERGY CALCULATOR (BENTO CARD 2)
            =================================================================== */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-4 sm:p-6 md:p-8 shadow-sm backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/80 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 sm:pb-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Marketplace Liquidity &amp; Equity Insights
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 sm:mt-1">
                Explore Market Standards by Role
              </h3>
            </div>

            {/* Role Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono">
              {[
                { id: "ai", label: "AI Engineer" },
                { id: "fullstack", label: "Fullstack" },
                { id: "design", label: "Designer" },
                { id: "growth", label: "Growth" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSelectedRole(pill.id)}
                  className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedRole === pill.id
                      ? "bg-violet-600 text-white shadow-xs"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Role Metrics Grid */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 font-mono">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3 sm:p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                Typical Equity Range
              </span>
              <p className="mt-1 text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">
                {activeRoleData.avgEquity}
              </p>
              <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 block truncate">
                Based on stage
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3 sm:p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                Avg. Time to Team
              </span>
              <p className="mt-1 text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {activeRoleData.timeToTeam}
              </p>
              <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 block truncate">
                7x faster than agencies
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3 sm:p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                Active Hiring
              </span>
              <p className="mt-1 text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {activeRoleData.activeHiring}
              </p>
              <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 block truncate">
                Live opportunities
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-3 sm:p-4 dark:border-slate-800/60 dark:bg-slate-900/60">
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                Top Demand Skills
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {activeRoleData.primarySkills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-white px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            4. THE 3 CORE PILLARS OF STARTUPFORGE
            =================================================================== */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 space-y-2.5 sm:space-y-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 shadow-xs">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Zero Recruiter Taxes
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              No 25% agency commissions, corporate gatekeepers, or canned HR
              screeners. You speak directly with the founder steering the
              product vision.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 space-y-2.5 sm:space-y-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-xs">
              <Award className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Transparent Venture Stakes
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every opportunity lists transparent equity ranges, expected hourly
              commitments, and milestone scopes upfront before you ever apply.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80 space-y-2.5 sm:space-y-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-xs">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Verified Legitimacy
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every startup submission is moderated and verified for authentic
              roadmap viability, preventing ghost listings and protecting
              collaborator time.
            </p>
          </div>
        </div>

        {/* ===================================================================
            5. FINAL ACTION CTA
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center pt-2"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 hover:-translate-y-0.5 active:scale-95 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              <span>Build as Founder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/opportunities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300/90 bg-white px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-violet-400 hover:bg-slate-50 hover:text-violet-600 hover:-translate-y-0.5 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:bg-slate-900 dark:hover:text-violet-300"
            >
              <span>Explore Roles as Collaborator</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyJoinStartupForge;
