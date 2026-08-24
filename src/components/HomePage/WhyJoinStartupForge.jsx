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
    <section className="relative overflow-hidden py-20 lg:py-28 text-slate-900 transition-colors duration-300 dark:text-slate-100 font-sans">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 right-10 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-600/10 animate-float-slow" />

      <div className="container relative mx-auto flex flex-col px-6 lg:px-12 max-w-6xl">
        {/* Header Title */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 font-mono">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Why Join{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300">
              StartupForge
            </span>
            ?
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you have an idea and need a team, or have skills and want to
            build something extraordinary, StartupForge makes collaboration
            effortless.
          </p>
        </div>

        {/* Steps Cards Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {WHY_JOIN_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:border-violet-500/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 dark:border-slate-800 dark:bg-[#060C1A] shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className={`h-7 w-7 ${step.iconColor}`} />
                    </div>

                    <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-3 py-1 text-xs font-mono font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                      {step.stepNumber}
                    </span>
                  </div>

                  <div className="mt-6">
                    <span className="text-xs font-bold tracking-wider uppercase font-mono text-violet-600 dark:text-violet-400">
                      {step.tagline}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
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
              className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-700 hover:-translate-y-0.5 active:scale-95 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              <span>Get Started as Founder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-violet-400 hover:bg-slate-50 hover:text-violet-600 hover:-translate-y-0.5 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:bg-slate-900 dark:hover:text-violet-300"
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

