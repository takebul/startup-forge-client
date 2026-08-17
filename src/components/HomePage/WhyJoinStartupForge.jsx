import Link from "next/link";
import { Lightbulb, Search, Users, Rocket, ArrowRight } from "lucide-react";

const WHY_JOIN_STEPS = [
  {
    stepNumber: "Step 01",
    tagline: "For Founders & Creators",
    title: "Publish Your Vision & Build a Dream Team",
    description:
      "Stop searching through generic job boards. Post your startup pitch, outline exact skill requirements, time commitments, and equity or compensation structures to attract dedicated co-builders.",
    icon: Lightbulb,
    badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  {
    stepNumber: "Step 02",
    tagline: "For Collaborators & Talent",
    title: "Discover Real Opportunities & Apply Directly",
    description:
      "Skip traditional corporate application black holes. Explore early-stage, high-potential startups filtering by tech stack, industry, or role, and connect directly with the founders driving the project.",
    icon: Search,
    badgeColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
  },
  {
    stepNumber: "Step 03",
    tagline: "Seamless Recruitment",
    title: "Review Applications & Move Candidates Fast",
    description:
      "Founders receive structured candidate applications complete with portfolio links and skill tags. Accept or reject candidates with one click, triggering automated notifications and status tracking.",
    icon: Users,
    badgeColor: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-500 dark:text-violet-400",
  },
  {
    stepNumber: "Step 04",
    tagline: "Launch & Scale",
    title: "Bridge the Gap From Idea to Execution",
    description:
      "Turn side-project pitches into real, venture-backed companies. StartupForge provides the community, accountability, and talent directory required to launch products faster.",
    icon: Rocket,
    badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
];

const WhyJoinStartupForge = () => {
  return (
    <section className="bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-[#0c0c16] dark:text-slate-100 lg:py-24 font-sans">
      <div className="container mx-auto flex flex-col px-6 lg:px-12 max-w-6xl">
        {/* Header Title */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 font-mono">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Why Join StartupForge?
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed">
            Whether you have an idea and need a team, or have skills and want to
            build something extraordinary, StartupForge makes collaboration
            effortless.
          </p>
        </div>

        {/* Steps List */}
        <div className="mt-14 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800/80 dark:border-slate-800/80">
          {WHY_JOIN_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="grid grid-cols-1 items-center gap-6 py-10 lg:grid-cols-4 lg:gap-12 transition-colors hover:bg-slate-100/40 dark:hover:bg-white/[0.01] px-4 rounded-2xl"
              >
                {/* Icon Container */}
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/80 dark:border-slate-800 dark:bg-[#121422]">
                    <Icon className={`h-9 w-9 ${step.iconColor}`} />
                  </div>
                </div>

                {/* Text Description */}
                <div className="flex flex-col justify-center text-center lg:col-span-3 lg:text-left">
                  <span className="text-xs font-bold tracking-wider uppercase font-mono text-violet-600 dark:text-violet-400">
                    {step.stepNumber} — {step.tagline}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call-to-Action Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              <span>Get Started as Founder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-[#121422] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span>Explore Opportunities</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJoinStartupForge;
