"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Filter,
  Zap,
  ChevronDown,
  Star,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@heroui/react";

// -----------------------------------------------------------------------------
// FAQ DATA
// -----------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel or downgrade your subscription at any time directly from your dashboard settings. Your premium benefits will remain active until the end of your billing cycle.",
  },
  {
    question: "Is StartupForge exclusively for startup founders?",
    answer:
      "StartupForge is built for the entire ecosystem. Founders post startup ideas and recruit team members, while developers, designers, and marketers explore open positions and apply directly.",
  },
  {
    question: "What payment methods do you support?",
    answer:
      "We support all major global debit and credit cards, including Visa, Mastercard, American Express, and Discover through secure Stripe payment infrastructure.",
  },
  {
    question: "How does annual billing discount work?",
    answer:
      "When you choose yearly billing, you are billed once annually at a discounted rate, saving you 15% to 20% compared to paying monthly.",
  },
  {
    question: "Can I upgrade my plan as my team grows?",
    answer:
      "Absolutely. You can start on the Free plan to validate your concept and upgrade to Premium Founder or Enterprise whenever you need priority listing placement, applicant filters, or multi-seat team access.",
  },
];

// -----------------------------------------------------------------------------
// FEATURE HIGHLIGHTS DATA
// -----------------------------------------------------------------------------
const FEATURE_HIGHLIGHTS = [
  {
    icon: Rocket,
    title: "Unlimited Startup Postings",
    description:
      "Publish as many startup ideas and open roles as you need. Build co-founding teams across multiple ventures simultaneously.",
    iconBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    icon: TrendingUp,
    title: "Priority Listing Placement",
    description:
      "Featured listings appear at the top of the explore feed, gaining 3x higher visibility and attracting top-tier applicant talent.",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: Filter,
    title: "Precision Candidate Filtering",
    description:
      "Filter candidates by technical skill set, weekly hour availability, past startup experience, location, and portfolio link quality.",
    iconBg: "bg-purple-500/10 text-purple-400",
  },
  {
    icon: Zap,
    title: "Real-Time Recruitment Analytics",
    description:
      "Track profile views, application conversion rates, candidate funnel pipelines, and role fulfillment progress in real time.",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Sparkles,
    title: "One-Click Candidate Workflow",
    description:
      "Review candidates and update status to Accepted or Rejected with one click. Automated triggers keep applicants instantly notified.",
    iconBg: "bg-rose-500/10 text-rose-400",
  },
  {
    icon: ShieldCheck,
    title: "Verified Founder Badge",
    description:
      "Stand out on the platform with an official Verified badge on your profile and listings, building immediate trust with applicants.",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
];

export default function FounderPricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] font-sans text-slate-300">
      <div className="container mx-auto px-6 py-16 lg:px-12 lg:py-24">
        {/* =================================------------------------------------
            1. HERO & PRICING HEADER
        ================================------------------------------------- */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Empowering Founders & High-Impact Talent</span>
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Simple, Transparent <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-500 bg-clip-text text-transparent">
              Founder Pricing
            </span>
          </h1>

          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            Start for free to test your idea. Upgrade to unlock priority
            placement, advanced candidate filtering, and scaling recruitment
            tools.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center rounded-full border border-[#1E212B] bg-[#12141D] p-1.5">
              <button
                onClick={() => setIsYearly(false)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  !isYearly
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`flex items-center space-x-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  isYearly
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Save 15%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* =================================------------------------------------
            2. PRICING CARDS (Free, Premium Founder, Enterprise)
        ================================------------------------------------- */}

        <div className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* FREE PLAN */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#1E212B] bg-[#12141D] p-8 transition-all hover:border-[#2A2E3D]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold text-white">Free</h3>
              <p className="mt-1 text-xs text-slate-400">
                Ideal for early-stage founders launching their first concept.
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="ml-2 text-xs text-slate-500">/ month</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                No credit card required
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> 1 Active
                  Startup Listing
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> Up to 3
                  Open Team Roles
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> Basic
                  Candidate Applications
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> Standard
                  In-App Messaging
                </li>
                <li className="flex items-center text-slate-600 line-through">
                  <X className="mr-3 h-4 w-4 text-slate-600" /> Priority Listing
                  Placement
                </li>
                <li className="flex items-center text-slate-600 line-through">
                  <X className="mr-3 h-4 w-4 text-slate-600" /> Advanced
                  Applicant Filtering
                </li>
                <li className="flex items-center text-slate-600 line-through">
                  <X className="mr-3 h-4 w-4 text-slate-600" /> Verified Founder
                  Badge
                </li>
              </ul>
            </div>

            <Link
              href="/register?role=founder"
              className="mt-8 flex w-full items-center justify-center rounded-xl border border-[#232634] bg-[#151722] py-3 text-xs font-bold text-slate-200 transition-colors hover:bg-[#1E2130]"
            >
              Get Started Free
            </Link>
          </div>

          {/* PREMIUM FOUNDER PLAN (Highlighted Card) */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-indigo-500 bg-[#12141D] p-8 shadow-2xl shadow-indigo-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Accelerate
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold text-white">
                Premium Founder
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                For ambitious founders building dedicated core teams fast.
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">
                  ${isYearly ? "24" : "29"}
                </span>
                <span className="ml-2 text-xs text-slate-500">/ month</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {isYearly
                  ? "Billed annually ($288/yr)"
                  : "Billed monthly • Cancel anytime"}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                <li className="flex items-center font-semibold text-white">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> Everything
                  in Free
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" />{" "}
                  <strong>Unlimited</strong> Startup Posts & Roles
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" />{" "}
                  <strong>Priority Listing Placement</strong>
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> Advanced
                  Applicant Search & Filters
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> Full
                  Recruitment Dashboard
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> Candidate
                  Portfolio & Resume Preview
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" /> One-Click
                  Accept/Reject Workflow
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-indigo-400" />{" "}
                  <strong>Verified Founder Badge</strong>
                </li>
              </ul>
            </div>

            <div>
              <form method="POST" action={"/api/payments"}>
                <Button
                  type="submit"
                  className="mt-8 flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
                >
                  Upgrade to Premium — ${isYearly ? "24" : "29"}/mo
                </Button>
              </form>
              <p className="mt-2 text-center text-[10px] text-slate-500">
                🔒 Secure Stripe checkout | Cancel anytime
              </p>
            </div>
          </div>

          {/* ENTERPRISE / SCALE PLAN */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#1E212B] bg-[#12141D] p-8 transition-all hover:border-[#2A2E3D]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Scale & Studio
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold text-white">Enterprise</h3>
              <p className="mt-1 text-xs text-slate-400">
                For venture studios, incubators, and multi-team scaleups.
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">
                  ${isYearly ? "79" : "99"}
                </span>
                <span className="ml-2 text-xs text-slate-500">/ month</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {isYearly
                  ? "Billed annually ($948/yr)"
                  : "Billed monthly • Cancel anytime"}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center font-semibold text-white">
                  <Check className="mr-3 h-4 w-4 text-purple-400" /> Everything
                  in Premium Founder
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-purple-400" /> Multi-User
                  Team Access (Up to 10 Seats)
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-purple-400" /> Custom
                  White-Label Talent Portal
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-purple-400" /> API Access
                  & ATS Syncing
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-purple-400" /> Dedicated
                  Account Strategist
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-purple-400" /> Custom
                  Legal & Equity Agreements
                </li>
                <li className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-purple-400" /> 24/7
                  Priority Support (SLA)
                </li>
              </ul>
            </div>

            <div>
              <Link
                href="/register?role=founder&plan=enterprise"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-purple-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500"
              >
                Get Enterprise — ${isYearly ? "79" : "99"}/mo
              </Link>
              <p className="mt-2 text-center text-[10px] text-slate-500">
                🔒 Instant account activation | Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* =================================------------------------------------
            3. FEATURE HIGHLIGHTS GRID ("Everything You Need")
        ================================------------------------------------- */}
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Complete Recruitment Ecosystem
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Everything You Need to Build Your Core Team
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              StartupForge is more than just a job board—it is an end-to-end
              matching platform built specifically for early-stage recruitment.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_HIGHLIGHTS.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#1E212B] bg-[#12141D] p-6 transition-all hover:border-[#2A2E3D]"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================------------------------------------
            4. COMPARISON TABLE
        ================================------------------------------------- */}
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Full Feature Comparison
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Compare plan capabilities side by side
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#1E212B] bg-[#12141D]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-[#1E212B] bg-[#0F111A] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold">Free</th>
                  <th className="px-6 py-4 text-center font-bold text-indigo-400">
                    Premium Founder
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-purple-400">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E212B]">
                {[
                  {
                    feature: "Active Startup Listings",
                    free: "1 Active",
                    premium: "Unlimited",
                    enterprise: "Unlimited",
                  },
                  {
                    feature: "Open Team Roles",
                    free: "Up to 3",
                    premium: "Unlimited",
                    enterprise: "Unlimited",
                  },
                  {
                    feature: "Priority Search Placement",
                    free: "—",
                    premium: "Included",
                    enterprise: "Top Tier",
                  },
                  {
                    feature: "Advanced Candidate Filtering",
                    free: "—",
                    premium: "Included",
                    enterprise: "Included",
                  },
                  {
                    feature: "Recruitment Analytics",
                    free: "Basic",
                    premium: "Full Dashboard",
                    enterprise: "Advanced Custom",
                  },
                  {
                    feature: "Verified Founder Badge",
                    free: "—",
                    premium: "Included",
                    enterprise: "Verified Studio",
                  },
                  {
                    feature: "Team Seats",
                    free: "1 Seat",
                    premium: "1 Seat",
                    enterprise: "Up to 10 Seats",
                  },
                  {
                    feature: "Support Tier",
                    free: "Community",
                    premium: "Priority Email",
                    enterprise: "24/7 SLA + Manager",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#151722]">
                    <td className="px-6 py-4 font-semibold text-white">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      {row.free}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-400">
                      {row.premium}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-purple-400">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================================------------------------------------
            5. TESTIMONIALS
        ================================------------------------------------- */}
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Founders Build Faster on StartupForge
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Real results from founders who recruited their core teams with us
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "The priority listing placement doubled our inbound candidate flow in 48 hours. We connected with an exceptional Full-Stack Lead who is now our technical co-founder.",
                author: "Alex Rivera",
                role: "Founder @ NexusAI",
                avatar:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
              },
              {
                quote:
                  "Filtering by tech stack and weekly time commitment helped us recruit 3 developers in under a week. StartupForge saved us months of searching on generic job boards.",
                author: "Sarah Kim",
                role: "Founder @ EcoGrid",
                avatar:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
              },
              {
                quote:
                  "The one-click application review board simplified candidate evaluation completely, and the Verified Founder badge added immediate trust to our pitch.",
                author: "David Miller",
                role: "Founder @ HealthSphere",
                avatar:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-[#1E212B] bg-[#12141D] p-6"
              >
                <div>
                  <div className="flex space-x-1 text-amber-400">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-300 italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-3 border-t border-[#1E212B] pt-4">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{t.author}</p>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================------------------------------------
            6. FREQUENTLY ASKED QUESTIONS (FAQ)
        ================================------------------------------------- */}
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Everything you need to know about Founder plans & pricing
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#1E212B] bg-[#12141D]"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white transition-colors hover:bg-[#151722]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[#1E212B] px-5 py-4 text-xs leading-relaxed text-slate-400"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* =================================------------------------------------
            7. BOTTOM CTA BANNER
        ================================------------------------------------- */}
        <div className="mt-28">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-[#0F111A] p-10 text-center shadow-2xl border border-indigo-500/20 md:p-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
              <Crown className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              Start Building Your Dream Team Today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-indigo-200/80">
              Join hundreds of startup founders who recruited technical and
              creative collaborators on StartupForge.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register?role=founder&plan=premium"
                className="rounded-xl bg-white px-8 py-3.5 text-xs font-bold text-indigo-950 shadow-lg transition-transform hover:scale-105"
              >
                Upgrade to Premium — ${isYearly ? "24" : "29"}/mo
              </Link>
              <Link
                href="/register?role=founder"
                className="rounded-xl border border-indigo-400/30 bg-indigo-950/50 px-8 py-3.5 text-xs font-bold text-indigo-200 transition-colors hover:bg-indigo-900/50"
              >
                Start Free
              </Link>
            </div>

            <p className="mt-4 text-[10px] text-indigo-300/60">
              No credit card required for the Free plan • Upgrade or cancel
              anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
