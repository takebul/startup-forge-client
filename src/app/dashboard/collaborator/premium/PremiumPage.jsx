"use client";

import { useMemo } from "react";
import { Btn, Badge } from "@/components/Dashboard/founder-dashboard-shared";

// Fallback Plans Data matching server MongoDB documents
const COLLABORATOR_PLANS = [
  {
    _id: "6a71ed6f0f5c8dddeba7489a",
    plan_id: "collaborator_free",
    name: "Free",
    price: "$0",
    maxApplicationPerMonth: 3,
    description: "Basic access for exploring startup opportunities.",
    badgeColor: "gray",
  },
  {
    _id: "6a71ed6f0f5c8dddeba7489b",
    plan_id: "collaborator_premium",
    name: "Premium Collaborator",
    price: "$19",
    maxApplicationPerMonth: 10,
    description:
      "Accelerate your career with 3x higher application visibility.",
    badgeColor: "amber",
  },
  {
    _id: "6a71ed6f0f5c8dddeba7489c",
    plan_id: "collaborator_enterprise",
    name: "Enterprise",
    price: "$49",
    maxApplicationPerMonth: 100,
    description: "Maximum application quota & direct venture studio access.",
    badgeColor: "indigo",
  },
];

export default function PremiumPage({ user, plansData }) {
  // 1. Safely extract plans array
  const plans = useMemo(() => {
    const list = Array.isArray(plansData)
      ? plansData
      : Array.isArray(plansData?.data)
        ? plansData.data
        : [];
    return list.length > 0 ? list : COLLABORATOR_PLANS;
  }, [plansData]);

  // 2. Identify active plan and level
  const userPlanKey = String(
    user?.plan || user?.plan_id || "collaborator_free",
  ).toLowerCase();

  const isPremiumOrEnterprise =
    userPlanKey.includes("premium") ||
    userPlanKey.includes("enterprise") ||
    userPlanKey === "collaborator_premium" ||
    userPlanKey === "collaborator_enterprise";

  const isEnterprise =
    userPlanKey.includes("enterprise") ||
    userPlanKey === "collaborator_enterprise";

  const currentPlan = useMemo(() => {
    return (
      plans.find(
        (p) =>
          p.plan_id?.toLowerCase() === userPlanKey ||
          p.name?.toLowerCase().includes(userPlanKey),
      ) || (isPremiumOrEnterprise ? plans[1] || plans[0] : plans[0])
    );
  }, [plans, userPlanKey, isPremiumOrEnterprise]);

  const maxApplications =
    currentPlan?.maxApplicationPerMonth || (isPremiumOrEnterprise ? 10 : 3);

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100">
          Collaborator Membership
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your application quotas, profile badges, and recruitment tier
          benefits.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* STATE A: UPGRADED USER (PREMIUM / ENTERPRISE CONGRATULATIONS PAGE)       */}
      {/* ========================================================================= */}
      {isPremiumOrEnterprise ? (
        <div className="space-y-6">
          {/* CONGRATULATIONS HERO BANNER */}
          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#0D1528] via-[#121B35] to-[#0A1020] border border-amber-500/30 shadow-xl space-y-6">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-8xl">
              👑
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  Active Subscription
                </span>
                <h3 className="text-2xl font-extrabold text-slate-100 mt-2">
                  Congratulations! You are using the{" "}
                  {currentPlan?.name || "Premium Plan"}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Your account is fully upgraded. You now enjoy priority placement
              in founder review pipelines, a verified collaborator badge, and an
              expanded monthly application quota.
            </p>

            {/* QUOTA STATS BAR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-[#060C1A] border border-slate-800/80">
                <p className="text-[11px] font-mono text-slate-500 uppercase">
                  Current Tier
                </p>
                <p className="text-sm font-bold text-amber-500 font-mono mt-1">
                  {currentPlan?.name || "Premium Collaborator"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#060C1A] border border-slate-800/80">
                <p className="text-[11px] font-mono text-slate-500 uppercase">
                  Monthly Application Quota
                </p>
                <p className="text-sm font-bold text-emerald-400 font-mono mt-1">
                  Up to {maxApplications} Roles / Month
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#060C1A] border border-slate-800/80">
                <p className="text-[11px] font-mono text-slate-500 uppercase">
                  Status
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                  <span>✓</span> Verified Collaborator
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE PREMIUM FEATURES GRID */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Your Unlocked Premium Features
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0D1528] border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-500 text-sm font-bold">
                  <span>⚡</span> Extended Application Quota
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Apply for up to{" "}
                  <strong className="text-slate-200">
                    {maxApplications} startup opportunities
                  </strong>{" "}
                  every month without encountering posting limits.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1528] border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                  <span>🌟</span> Priority Applicant Placement
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your applications appear highlighted at the top of founder
                  candidate boards for faster review and higher response rates.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1528] border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <span>🛡️</span> Verified Collaborator Badge
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  An official verified shield appears on your public profile and
                  application submissions, instilling immediate trust with
                  founders.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1528] border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
                  <span>💬</span> Direct Founder Communication
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gain instant access to direct messaging channels when founders
                  review your motivation messages and portfolio links.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* NEW FEATURE: ENTERPRISE UPGRADE BANNER FOR PREMIUM SUBSCRIBERS            */}
          {/* ========================================================================= */}
          {!isEnterprise && (
            <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0D1528] via-[#151A30] to-[#0D1528] border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl mt-8">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                    🚀 Next Tier Available
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-100">
                  Interested in Upgrading to the Enterprise Plan?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need even more bandwidth? Upgrade your plan to{" "}
                  <strong className="text-indigo-300">Enterprise</strong> to
                  unlock up to{" "}
                  <strong className="text-slate-200">
                    100 applications per month
                  </strong>
                  , top-tier featured applicant status, and direct venture
                  studio access.
                </p>
              </div>

              {/* STRIPE SUBSCRIPTION POST FORM FOR ENTERPRISE */}
              <form
                method="POST"
                action="/api/subscription"
                className="shrink-0"
              >
                <input
                  type="hidden"
                  name="plan_id"
                  value="collaborator_enterprise"
                />
                <Btn type="submit" variant="primary">
                  Upgrade to Enterprise — $49/mo
                </Btn>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* STATE B: FREE USER (SHOW FREE STATUS & PROMPT PREMIUM UPGRADE)            */
        /* ========================================================================= */
        <div className="space-y-8">
          {/* FREE USER STATUS BANNER */}
          <div className="p-6 rounded-2xl bg-[#0D1528] border border-amber-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    You are currently using the{" "}
                    <span className="text-amber-500">Free Plan</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Free accounts are limited to {maxApplications} applications
                    per month and basic profile visibility.
                  </p>
                </div>
              </div>

              <Badge
                label={`Limit: ${maxApplications} Applications/Mo`}
                variant="gray"
              />
            </div>

            {/* FREE FEATURES LIST */}
            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap gap-x-6 gap-y-2 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 3 Applications per
                month
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Standard profile
                listing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Basic application
                tracking
              </span>
            </div>
          </div>

          {/* UPGRADE PROMPT HERO */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">
              Upgrade Your Collaborator Career
            </span>
            <h3 className="text-2xl font-bold text-slate-100">
              Unlock Premium Features & 3x Application Quota
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stand out to founders, get priority application review placement,
              and increase your monthly opportunity limit up to 100
              applications.
            </p>
          </div>

          {/* PLAN UPGRADE CARDS (STRIPE POST ACTION FORM INTEGRATION) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PREMIUM COLLABORATOR CARD */}
            <div className="rounded-3xl p-6 bg-[#0D1528] border-2 border-amber-500/40 relative flex flex-col justify-between space-y-6 shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-[10px] uppercase">
                RECOMMENDED FOR COLLABORATORS
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-100">
                    Premium Collaborator
                  </h4>
                  <span className="text-xl font-extrabold text-amber-500 font-mono">
                    $19
                    <span className="text-xs font-normal text-slate-500">
                      /mo
                    </span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal for active developers, designers, and marketers seeking
                  core startup roles.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 font-semibold text-slate-100">
                    <span className="text-amber-500">✓</span> Up to 10
                    Applications per Month
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span> Priority
                    Application Placement
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span> Verified
                    Collaborator Profile Badge
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span> Early Access to
                    Newly Posted Roles
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span> Direct Founder
                    Messaging
                  </div>
                </div>
              </div>

              {/* STRIPE SUBSCRIPTION POST FORM */}
              <form method="POST" action="/api/subscription" className="pt-2">
                <input
                  type="hidden"
                  name="plan_id"
                  value="collaborator_premium"
                />
                <Btn type="submit" fullWidth>
                  Upgrade to Premium — $19/mo
                </Btn>
              </form>
            </div>

            {/* ENTERPRISE CARD */}
            <div className="rounded-3xl p-6 bg-[#0D1528] border border-slate-800 relative flex flex-col justify-between space-y-6 hover:border-slate-700 transition-colors">
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-100">
                    Enterprise
                  </h4>
                  <span className="text-xl font-extrabold text-indigo-400 font-mono">
                    $49
                    <span className="text-xs font-normal text-slate-500">
                      /mo
                    </span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  For power collaborators, advisors, and fractional executives
                  working across ventures.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 font-semibold text-slate-100">
                    <span className="text-indigo-400">✓</span> Up to 100
                    Applications per Month
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> All Premium
                    Collaborator Benefits
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Top-Tier Featured
                    Applicant Status
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Portfolio &
                    Github Highlight Integration
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Dedicated Account
                    Support
                  </div>
                </div>
              </div>

              {/* STRIPE SUBSCRIPTION POST FORM */}
              <form method="POST" action="/api/subscription" className="pt-2">
                <input
                  type="hidden"
                  name="plan_id"
                  value="collaborator_enterprise"
                />
                <Btn type="submit" variant="ghost" fullWidth>
                  Get Enterprise — $49/mo
                </Btn>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
