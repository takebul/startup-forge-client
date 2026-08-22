import {
  Rocket,
  TrendingUp,
  Filter,
  Zap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const FEATURE_HIGHLIGHTS = [
  {
    icon: Rocket,
    title: "Scalable Postings & Applications",
    description:
      "Access 3, 10, or up to 100 monthly slots depending on your tier. Accelerate partnerships across multiple projects simultaneously.",
    iconBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    icon: TrendingUp,
    title: "Priority Listing Placement",
    description:
      "Featured listings and candidate submissions receive priority visibility, connecting top talent with vetted founders faster.",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: Filter,
    title: "Precision Candidate Filtering",
    description:
      "Filter talent by technical stack, weekly availability, startup stage experience, and verified portfolio quality.",
    iconBg: "bg-purple-500/10 text-purple-400",
  },
  {
    icon: Zap,
    title: "Real-Time Pipeline Analytics",
    description:
      "Track role conversion rates, application funnel progress, profile engagement, and recruitment milestones in real time.",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Sparkles,
    title: "One-Click Workflow Management",
    description:
      "Review applicants and update statuses instantly. Automated triggers keep team candidates notified at every step.",
    iconBg: "bg-rose-500/10 text-rose-400",
  },
  {
    icon: ShieldCheck,
    title: "Verified Platform Badge",
    description:
      "Stand out on StartupForge with an official Verified badge on your profile and listings, building immediate platform credibility.",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
];

export default function PricingFeatures() {
  return (
    <section className="mt-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Complete Matching Platform
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          Everything You Need to Connect and Build
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          StartupForge provides end-to-end recruitment matching, verified
          reputation badges, and real-time application tracking.
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
    </section>
  );
}
