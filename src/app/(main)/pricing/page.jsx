"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  Rocket,
  Crown,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

// Import Destructured Modular Components
import PricingFeatures from "@/components/Pricing/PricingFeatures";
import PricingComparisonTable from "@/components/Pricing/PricingComparisonTable";
import PricingTestimonials from "@/components/Pricing/PricingTestimonials";
import PricingFaq from "@/components/Pricing/PricingFaq";

function getPlanTierRank(planId) {
  if (!planId) return 0;
  const normalized = String(planId).toLowerCase();
  if (normalized.includes("enterprise")) return 2;
  if (normalized.includes("premium")) return 1;
  return 0;
}

function getUserPersona(u) {
  if (!u) return "guest";
  const role = String(u.role || "").toLowerCase();
  const accountType = String(u.accountType || "").toLowerCase();

  if (role === "admin") return "admin";
  if (accountType === "collaborator" || role === "collaborator")
    return "collaborator";
  return "founder";
}

const FOUNDER_PLANS = [
  {
    plan_id: "founder_free",
    name: "Free",
    tagline: "Starter",
    description:
      "Ideal for early-stage founders testing their first startup concept.",
    price: "$0",
    period: "/ month",
    billingNote: "No credit card required",
    badgeColor: "text-slate-500",
    features: [
      { text: "1 Active Startup Listing", included: true },
      { text: "Up to 3 Open Opportunity Roles", included: true, isBold: true },
      { text: "Basic Candidate Applications", included: true },
      { text: "Standard In-App Messaging", included: true },
      { text: "Priority Listing Placement", included: false },
      { text: "Advanced Applicant Filtering", included: false },
      { text: "Verified Founder Badge", included: false },
    ],
  },
  {
    plan_id: "founder_premium",
    name: "Premium Founder",
    tagline: "Accelerate",
    description: "For ambitious founders building dedicated core teams fast.",
    price: "$29",
    period: "/ month",
    billingNote: "Billed monthly • Cancel anytime",
    isPopular: true,
    popularTag: "Most Popular",
    badgeColor: "text-amber-400",
    features: [
      { text: "Everything in Free", included: true, isBold: true },
      { text: "Up to 10 Open Opportunity Roles", included: true, isBold: true },
      { text: "Priority Listing Placement", included: true, isBold: true },
      { text: "Advanced Applicant Search & Filters", included: true },
      { text: "Full Recruitment Dashboard", included: true },
      { text: "Candidate Portfolio & Resume Preview", included: true },
      { text: "Verified Founder Badge", included: true, isBold: true },
    ],
  },
  {
    plan_id: "founder_enterprise",
    name: "Enterprise Founder",
    tagline: "Scale & Studio",
    description: "For venture studios, incubators, and multi-team scaleups.",
    price: "$99",
    period: "/ month",
    billingNote: "Billed monthly • Cancel anytime",
    badgeColor: "text-purple-400",
    features: [
      { text: "Everything in Premium Founder", included: true, isBold: true },
      {
        text: "Up to 100 Open Opportunity Roles",
        included: true,
        isBold: true,
      },
      { text: "Multi-User Team Access (Up to 10 Seats)", included: true },
      { text: "Custom White-Label Talent Portal", included: true },
      { text: "ATS & Webhook API Syncing", included: true },
      { text: "24/7 Dedicated Account Manager", included: true },
    ],
  },
];

const COLLABORATOR_PLANS = [
  {
    plan_id: "collaborator_free",
    name: "Free",
    tagline: "Explore",
    description:
      "Discover ambitious startup projects and apply to open positions.",
    price: "$0",
    period: "/ month",
    billingNote: "Free forever • No card required",
    badgeColor: "text-slate-500",
    features: [
      { text: "Apply to up to 3 Roles / Month", included: true, isBold: true },
      { text: "Custom Collaborator Portfolio Profile", included: true },
      { text: "Direct Founder In-App Chat", included: true },
      { text: "Standard Application Queue", included: true },
      { text: "Priority Application Highlighting", included: false },
      { text: "Verified Talent Badge", included: false },
      { text: "Application Analytics & Profile Views", included: false },
    ],
  },
  {
    plan_id: "collaborator_premium",
    name: "Premium Collaborator",
    tagline: "High Impact",
    description:
      "For specialists, engineers, and designers looking to join high-growth teams.",
    price: "$19",
    period: "/ month",
    billingNote: "Billed monthly • Cancel anytime",
    isPopular: true,
    popularTag: "Best Value",
    badgeColor: "text-indigo-400",
    features: [
      { text: "Everything in Free", included: true, isBold: true },
      { text: "Apply to up to 10 Roles / Month", included: true, isBold: true },
      {
        text: "Priority Application Highlighting",
        included: true,
        isBold: true,
      },
      { text: "Verified Talent Profile Badge", included: true, isBold: true },
      { text: "Profile Views & Resume Click Tracking", included: true },
      { text: "Early Access to Newly Posted Roles", included: true },
    ],
  },
  {
    plan_id: "collaborator_enterprise",
    name: "Enterprise Collaborator",
    tagline: "Executive",
    description:
      "For seasoned co-founders, fractional executives, and senior leads.",
    price: "$49",
    period: "/ month",
    billingNote: "Billed monthly • Cancel anytime",
    badgeColor: "text-purple-400",
    features: [
      {
        text: "Everything in Premium Collaborator",
        included: true,
        isBold: true,
      },
      {
        text: "Apply to up to 100 Roles / Month",
        included: true,
        isBold: true,
      },
      { text: "Top-Tier Talent Showcase Placement", included: true },
      { text: "Direct Co-Founder Matchmaking Invitations", included: true },
      { text: "Equity & Contract Advisory Guidance", included: true },
      { text: "VIP Priority Support", included: true },
    ],
  },
];

export default function PricingPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const persona = useMemo(() => getUserPersona(user), [user]);
  const isAdmin = persona === "admin";
  const isGuest = persona === "guest";

  const showToggle = isGuest || isAdmin;
  const [selectedTab, setSelectedTab] = useState("founder");

  const currentViewTab = showToggle
    ? selectedTab
    : persona === "collaborator"
      ? "collaborator"
      : "founder";

  const isCollaboratorView = currentViewTab === "collaborator";
  const activePlans = isCollaboratorView ? COLLABORATOR_PLANS : FOUNDER_PLANS;

  const activePlanId =
    user?.plan ||
    user?.plan_id ||
    (persona === "collaborator" ? "collaborator_free" : "founder_free");

  const userRank = useMemo(
    () => (user && !isAdmin ? getPlanTierRank(activePlanId) : -1),
    [user, activePlanId, isAdmin],
  );

  return (
    <div className="min-h-screen bg-[#0A0C10] font-sans text-slate-300">
      <div className="container mx-auto px-6 py-16 lg:px-12 lg:py-24">
        {/* Admin All-Access Banner */}
        {isAdmin && (
          <div className="mb-10 mx-auto max-w-4xl p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-300">
                  Administrator All-Access Active
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your account has unlimited administrative permissions.
                  Subscriptions are not required.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors whitespace-nowrap"
            >
              Open Admin Panel →
            </Link>
          </div>
        )}

        {/* Hero Header & Switcher */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Scale Faster with StartupForge</span>
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Simple, Transparent <br />
            <span
              className={`bg-gradient-to-r ${
                isCollaboratorView
                  ? "from-indigo-400 via-purple-300 to-indigo-500"
                  : "from-amber-400 via-indigo-300 to-purple-400"
              } bg-clip-text text-transparent`}
            >
              {isCollaboratorView ? "Collaborator Pricing" : "Founder Pricing"}
            </span>
          </h1>

          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            {isCollaboratorView
              ? "Discover vetted startup opportunities, unlock priority applications, and join high-growth ventures."
              : "Recruit co-founders, engineers, and specialists. Scale your open opportunity listings with ease."}
          </p>

          {showToggle && (
            <div className="mt-8 inline-flex items-center rounded-2xl bg-[#12141D] p-1.5 border border-[#1E212B]">
              <button
                type="button"
                onClick={() => setSelectedTab("founder")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTab === "founder"
                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Rocket className="w-4 h-4" />
                <span>For Founders</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("collaborator")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTab === "collaborator"
                    ? "bg-indigo-600 text-white shadow-md font-extrabold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>For Collaborators</span>
              </button>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activePlans.map((plan) => {
            const planRank = getPlanTierRank(plan.plan_id);
            const isCurrentPlan = user && !isAdmin && planRank === userRank;
            const isUpgrade = user && !isAdmin && planRank > userRank;
            const isDowngrade = user && !isAdmin && planRank < userRank;
            const isPopular = plan.isPopular && !isCurrentPlan && !isAdmin;

            let buttonText = "";
            if (isAdmin) {
              buttonText = "Included with Admin Access";
            } else if (!user) {
              buttonText =
                plan.price === "$0"
                  ? "Get Started Free"
                  : `Get ${plan.name} — ${plan.price}/mo`;
            } else if (isCurrentPlan) {
              buttonText = "Current Active Plan";
            } else if (isUpgrade) {
              buttonText = `Upgrade to ${plan.name} — ${plan.price}/mo`;
            } else if (isDowngrade) {
              buttonText =
                plan.price === "$0"
                  ? "Switch to Free"
                  : `Switch to ${plan.name} — ${plan.price}/mo`;
            } else {
              buttonText = `Select ${plan.name} — ${plan.price}/mo`;
            }

            return (
              <div
                key={plan.plan_id}
                className={`relative flex flex-col justify-between rounded-3xl bg-[#12141D] p-8 transition-all ${
                  isCurrentPlan
                    ? "border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10"
                    : isPopular
                      ? isCollaboratorView
                        ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10"
                        : "border-2 border-amber-500 shadow-2xl shadow-amber-500/10"
                      : "border border-[#1E212B] hover:border-[#2A2E3D]"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    <span>Your Active Plan</span>
                  </div>
                )}

                {isPopular && plan.popularTag && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow ${
                      isCollaboratorView
                        ? "bg-indigo-600"
                        : "bg-amber-500 text-slate-950 font-bold"
                    }`}
                  >
                    {plan.popularTag}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${plan.badgeColor}`}
                    >
                      {plan.tagline}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {plan.billingNote}
                  </p>

                  <ul className="mt-8 space-y-3 text-xs text-slate-300">
                    {plan.features.map((feature, fIdx) => (
                      <li
                        key={`${plan.plan_id}-feat-${fIdx}`}
                        className={`flex items-center ${
                          !feature.included
                            ? "text-slate-600 line-through"
                            : feature.isBold
                              ? "font-semibold text-white"
                              : ""
                        }`}
                      >
                        {feature.included ? (
                          <Check
                            className={`mr-3 h-4 w-4 shrink-0 ${
                              isCurrentPlan
                                ? "text-emerald-400"
                                : isCollaboratorView
                                  ? "text-indigo-400"
                                  : "text-amber-400"
                            }`}
                          />
                        ) : (
                          <X className="mr-3 h-4 w-4 shrink-0 text-slate-600" />
                        )}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  {isAdmin ? (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/30 py-3.5 text-xs font-bold text-purple-300 opacity-90 cursor-not-allowed font-mono"
                    >
                      <Crown className="w-4 h-4 text-purple-400" />
                      <span>{buttonText}</span>
                    </button>
                  ) : isCurrentPlan ? (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-3.5 text-xs font-bold text-emerald-400 opacity-90 cursor-not-allowed font-mono"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{buttonText}</span>
                    </button>
                  ) : !user ? (
                    <Link
                      href={
                        plan.price === "$0"
                          ? `/signup?accountType=${currentViewTab}`
                          : `/signin?redirect=/pricing`
                      }
                      className={`flex w-full items-center justify-center rounded-xl py-3.5 text-xs font-bold transition-all ${
                        isCollaboratorView
                          ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20 shadow-lg"
                          : "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20 shadow-lg"
                      }`}
                    >
                      {buttonText}
                    </Link>
                  ) : plan.price === "$0" ? (
                    <Link
                      href={
                        persona === "collaborator"
                          ? "/dashboard/collaborator/profile"
                          : "/dashboard/founder/profile"
                      }
                      className="flex w-full items-center justify-center rounded-xl border border-slate-800 bg-white/5 py-3.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                    >
                      {buttonText}
                    </Link>
                  ) : (
                    <form method="POST" action="/api/subscription">
                      <input
                        type="hidden"
                        name="plan_id"
                        value={plan.plan_id}
                      />
                      <Button
                        type="submit"
                        className={`flex w-full items-center justify-center rounded-xl py-3.5 text-xs font-bold transition-all cursor-pointer ${
                          isDowngrade
                            ? "border border-slate-700 bg-[#161926] text-slate-200 hover:bg-[#1f2336]"
                            : isCollaboratorView
                              ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                              : "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                        }`}
                      >
                        {buttonText}
                      </Button>
                    </form>
                  )}

                  <p className="mt-2 text-center text-[10px] text-slate-500">
                    {isAdmin
                      ? "Full admin capabilities enabled"
                      : isCurrentPlan
                        ? "Manage billing details from your dashboard profile"
                        : plan.price === "$0"
                          ? "Instant access • No credit card required"
                          : "🔒 Secure Stripe checkout | Cancel anytime"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Destructured Sections */}
        <PricingFeatures />
        <PricingComparisonTable />
        <PricingTestimonials />
        <PricingFaq />
      </div>
    </div>
  );
}
