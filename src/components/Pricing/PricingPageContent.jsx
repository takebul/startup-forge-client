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

// Import Modular Components
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
    badgeColor: "text-slate-500 dark:text-slate-400",
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
    badgeColor: "text-amber-600 dark:text-amber-400",
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
    badgeColor: "text-violet-600 dark:text-violet-400",
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
    badgeColor: "text-slate-500 dark:text-slate-400",
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
    badgeColor: "text-violet-600 dark:text-violet-400",
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
    badgeColor: "text-purple-600 dark:text-purple-400",
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

export default function PricingPageContent() {
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
    <div className="relative min-h-screen overflow-hidden bg-white py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 sm:py-20 lg:py-24 font-sans">
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-600/10" />

      <div className="container relative mx-auto px-6 lg:px-12">
        {/* Admin All-Access Banner */}
        {isAdmin && (
          <div className="mb-10 mx-auto max-w-4xl p-5 rounded-2xl bg-purple-50 border border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">
                  Administrator All-Access Active
                </h4>
                <p className="text-xs text-purple-700 dark:text-slate-400 mt-0.5">
                  Your account has unlimited administrative permissions.
                  Subscriptions are not required.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors whitespace-nowrap shadow-xs"
            >
              Open Admin Panel →
            </Link>
          </div>
        )}

        {/* Hero Header & Switcher */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-violet-50 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            <span>Transparent Pricing Plans</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Simple, Scalable <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
              {isCollaboratorView ? "Collaborator Plans" : "Founder Plans"}
            </span>
          </h1>

          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed">
            {isCollaboratorView
              ? "Discover vetted startup opportunities, unlock priority applications, and join high-growth ventures."
              : "Recruit co-founders, engineers, and specialists. Scale your open opportunity listings with ease."}
          </p>

          {showToggle && (
            <div className="mt-8 inline-flex items-center rounded-2xl bg-slate-100 p-1.5 border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setSelectedTab("founder")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTab === "founder"
                    ? "bg-violet-600 text-white shadow-md font-extrabold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
                    ? "bg-violet-600 text-white shadow-md font-extrabold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
                className={`relative flex flex-col justify-between rounded-3xl bg-white p-8 transition-all dark:bg-slate-900/80 ${
                  isCurrentPlan
                    ? "border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10"
                    : isPopular
                      ? "border-2 border-violet-600 shadow-2xl shadow-violet-600/10 dark:border-violet-500"
                      : "border border-slate-200/90 hover:border-violet-300 dark:border-slate-800/90 dark:hover:border-violet-500/40 shadow-sm hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    <span>Your Active Plan</span>
                  </div>
                )}

                {isPopular && plan.popularTag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow bg-violet-600">
                    {plan.popularTag}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider font-mono ${plan.badgeColor}`}
                    >
                      {plan.tagline}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {plan.billingNote}
                  </p>

                  <ul className="mt-8 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feature, fIdx) => (
                      <li
                        key={`${plan.plan_id}-feat-${fIdx}`}
                        className={`flex items-center ${
                          !feature.included
                            ? "text-slate-400 dark:text-slate-600 line-through"
                            : feature.isBold
                              ? "font-semibold text-slate-900 dark:text-white"
                              : ""
                        }`}
                      >
                        {feature.included ? (
                          <Check
                            className={`mr-3 h-4 w-4 shrink-0 ${
                              isCurrentPlan
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-violet-600 dark:text-violet-400"
                            }`}
                          />
                        ) : (
                          <X className="mr-3 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
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
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-100 border border-purple-300 py-3.5 text-xs font-bold text-purple-700 opacity-90 cursor-not-allowed font-mono dark:bg-purple-500/10 dark:border-purple-500/30 dark:text-purple-300"
                    >
                      <Crown className="w-4 h-4 text-purple-500" />
                      <span>{buttonText}</span>
                    </button>
                  ) : isCurrentPlan ? (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 border border-emerald-300 py-3.5 text-xs font-bold text-emerald-700 opacity-90 cursor-not-allowed font-mono dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
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
                      className="flex w-full items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-700 text-white py-3.5 text-xs font-bold transition-all shadow-md shadow-violet-600/20"
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
                      className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
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
                            ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            : "bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-600/20"
                        }`}
                      >
                        {buttonText}
                      </Button>
                    </form>
                  )}

                  <p className="mt-2 text-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
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
