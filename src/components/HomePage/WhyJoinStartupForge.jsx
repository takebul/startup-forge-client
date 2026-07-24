import Link from "next/link";

const WHY_JOIN_STEPS = [
  {
    stepNumber: "Step 01",
    tagline: "For Founders & Creators",
    title: "Publish Your Vision & Build a Dream Team",
    description:
      "Stop searching through generic job boards. Post your startup pitch, outline exact skill requirements, time commitments, and equity or compensation structures to attract dedicated co-builders.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-violet-600 dark:text-violet-400"
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  {
    stepNumber: "Step 02",
    tagline: "For Collaborators & Talent",
    title: "Discover Real Opportunities & Apply Directly",
    description:
      "Skip traditional corporate application black holes. Explore early-stage, high-potential startups filtering by tech stack, industry, or role, and connect directly with the founders driving the project.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-violet-600 dark:text-violet-400"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
  {
    stepNumber: "Step 03",
    tagline: "Seamless Recruitment",
    title: "Review Applications & Move Candidates Fast",
    description:
      "Founders receive structured candidate applications complete with portfolio links and skill tags. Accept or reject candidates with one click, triggering automated notifications and status tracking.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-violet-600 dark:text-violet-400"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m16 11 2 2 4-4" />
      </svg>
    ),
  },
  {
    stepNumber: "Step 04",
    tagline: "Launch & Scale",
    title: "Bridge the Gap From Idea to Execution",
    description:
      "Turn side-project pitches into real, venture-backed companies. StartupForge provides the community, accountability, and talent directory required to launch products faster.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-violet-600 dark:text-violet-400"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

const WhyJoinStartupForge = () => {
  return (
    <section className="bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 lg:py-24">
      <div className="container mx-auto flex flex-col px-6 lg:px-12">
        {/* Header Title */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Why Join StartupForge?
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Whether you have an idea and need a team, or have skills and want to
            build something extraordinary, StartupForge makes collaboration
            effortless.
          </p>
        </div>

        {/* Steps List */}
        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {WHY_JOIN_STEPS.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center gap-6 p-8 mx-auto lg:gap-12"
            >
              {/* Icon Container */}
              <div className="col-span-full flex items-center justify-center lg:col-span-1">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                  {step.icon}
                </div>
              </div>

              {/* Text Description */}
              <div className="col-span-full flex flex-col justify-center text-center lg:col-span-3 lg:text-left">
                <span className="text-xs font-bold tracking-wider uppercase text-violet-600 dark:text-violet-400">
                  {step.stepNumber} — {step.tagline}
                </span>
                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register?role=founder"
              className="rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 dark:hover:bg-violet-500"
            >
              Get Started as Founder
            </Link>
            <Link
              href="/explore"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJoinStartupForge;
