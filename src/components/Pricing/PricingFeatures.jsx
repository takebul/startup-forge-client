import {
  Rocket,
  TrendingUp,
  Filter,
  Zap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

// Feature highlight cards: icon, title, description, and accent styling
const FEATURE_HIGHLIGHTS = [
  {
    icon: Rocket,
    title: "Scalable Postings & Applications",
    description:
      "Access 3, 10, or up to 100 monthly slots depending on your tier. Accelerate partnerships across multiple projects simultaneously.",
    iconBg:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    icon: TrendingUp,
    title: "Priority Listing Placement",
    description:
      "Featured listings and candidate submissions receive priority visibility, connecting top talent with vetted founders faster.",
    iconBg:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    icon: Filter,
    title: "Precision Candidate Filtering",
    description:
      "Filter talent by technical stack, weekly availability, startup stage experience, and verified portfolio quality.",
    iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  },
  {
    icon: Zap,
    title: "Real-Time Pipeline Analytics",
    description:
      "Track role conversion rates, application funnel progress, profile engagement, and recruitment milestones in real time.",
    iconBg:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    icon: Sparkles,
    title: "One-Click Workflow Management",
    description:
      "Review applicants and update statuses instantly. Automated triggers keep team candidates notified at every step.",
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  },
  {
    icon: ShieldCheck,
    title: "Verified Platform Badge",
    description:
      "Stand out on StartupForge with an official Verified badge on your profile and listings, building immediate platform credibility.",
    iconBg:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
];

export default function PricingFeatures() {
  return (
    <section className="mt-28">
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
          Complete Matching Platform
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Everything You Need to Connect and Build
        </h2>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
          StartupForge provides end-to-end recruitment matching, verified
          reputation badges, and real-time application tracking.
        </p>
      </div>

      {/* Feature highlight grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_HIGHLIGHTS.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:border-violet-500/40"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-xs ${item.iconBg}`}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

