import Link from "next/link";
import { Rocket, Plus, ArrowRight, Building2, Clock } from "lucide-react";
import AddOpportunity from "./AddOpportunity";
import { getUserSession } from "@/lib/core/session";
import { getPlansById } from "@/lib/api/plans";
import { getOpportunitiesByUserId } from "@/lib/api/opportunities";
import { getFounderStartup } from "@/lib/api/startups";

export const metadata = {
  title: "Post Opportunity — StartupForge Founder Dashboard",
  description:
    "Post new collaborative roles for engineering, design, marketing, and operations to recruit talent for your startup.",
};

const AddOpportunityPage = async () => {
  const user = await getUserSession();
  const startupData = await getOpportunitiesByUserId(user?.id);
  const plans = await getPlansById(user?.plan || "founder_free");
  const myStartup = await getFounderStartup(user?.id);

  // If founder has no registered startup profile, prompt them to create one
  if (myStartup.length === 0) {
    return (
      <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto font-sans">
        <div className="rounded-3xl p-10 bg-white border border-slate-200/90 text-center space-y-5 shadow-sm dark:bg-[#0D1528] dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-3xl mx-auto font-bold">
            <Rocket className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Startup Profile Required
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You haven&apos;t created a startup profile yet. You need to create
              and register your startup before posting collaborative role
              opportunities.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/founder/my-startup"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-md shadow-violet-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Startup Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStartup = myStartup[0];
  const startupName =
    currentStartup?.startup_name || currentStartup?.name || "Your Startup";
  const startupStatus = String(currentStartup?.status || "Pending");
  const isApproved =
    startupStatus.toLowerCase() === "approved" ||
    currentStartup?.approved === true ||
    currentStartup?.status === true;

  // 2. If the startup is pending admin approval, show the waiting screen
  if (!isApproved) {
    return (
      <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto font-sans">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Add Opportunity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Post collaborative opportunities to recruit co-builders for your
            project.
          </p>
        </div>

        {/* Pending Review Card */}
        <div className="rounded-3xl p-8 sm:p-12 bg-white border border-amber-200 text-center space-y-6 shadow-sm dark:bg-[#0D1528] dark:border-amber-500/20 relative overflow-hidden">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>STATUS: PENDING ADMIN APPROVAL</span>
          </div>

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 dark:bg-[#060C1A] dark:border-amber-500/30 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-10 h-10 animate-spin-slow" />
          </div>

          {/* Description */}
          <div className="space-y-3 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Your Startup Profile is Under Review
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We received your startup registration for{" "}
              <span className="text-violet-600 dark:text-amber-400 font-semibold font-mono">
                @{startupName}
              </span>
              . Our admin team is currently reviewing your profile to ensure
              platform quality.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#060C1A] dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-300">
                <Building2 className="w-4 h-4 text-violet-600 dark:text-amber-500 shrink-0" />
                <span className="font-bold truncate">{startupName}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                ⏳ Opportunity posting will be automatically unlocked as soon as
                an admin approves your profile. Please check back shortly.
              </p>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/founder/my-startup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-md shadow-violet-600/20 cursor-pointer"
            >
              <span>View Startup Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/founder"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-slate-800 transition-all cursor-pointer"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AddOpportunity opportunities={startupData} plans={plans} />
    </div>
  );
};

export default AddOpportunityPage;

