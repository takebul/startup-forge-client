import Link from "next/link";

const FEATURED_STARTUPS = [
  {
    id: "1",
    startup_name: "NexusAI",
    founder_name: "Sarah Chen",
    founder_email: "sarah@nexusai.io",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    industry: "Artificial Intelligence",
    description:
      "Building autonomous workflow agents to automate complex multi-step enterprise operations.",
    funding_stage: "Seed",
    team_size_needed: "3 Collaborators",
    status: "active",
  },
  {
    id: "2",
    startup_name: "EcoGrid",
    founder_name: "David Miller",
    founder_email: "david@ecogrid.tech",
    logo: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80",
    industry: "CleanTech",
    description:
      "Decentralized energy trading platform for micro-grids and community solar networks.",
    funding_stage: "Pre-Seed",
    team_size_needed: "5 Collaborators",
    status: "active",
  },
  {
    id: "3",
    startup_name: "PayPulse",
    founder_name: "Elena Rostova",
    founder_email: "elena@paypulse.fin",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80",
    industry: "FinTech",
    description:
      "Cross-border instant payroll solution designed specifically for global remote engineering teams.",
    funding_stage: "Series A",
    team_size_needed: "2 Collaborators",
    status: "active",
  },
  {
    id: "4",
    startup_name: "EcoGrid",
    founder_name: "David Miller",
    founder_email: "david@ecogrid.tech",
    logo: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80",
    industry: "CleanTech",
    description:
      "Decentralized energy trading platform for micro-grids and community solar networks.",
    funding_stage: "Pre-Seed",
    team_size_needed: "5 Collaborators",
    status: "active",
  },
  {
    id: "5",
    startup_name: "HealthSphere",
    founder_name: "Dr. Marcus Vance",
    founder_email: "marcus@healthsphere.med",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    industry: "HealthTech",
    description:
      "AI-assisted remote patient monitoring platform designed for post-surgery recovery tracking.",
    funding_stage: "Seed",
    team_size_needed: "4 Collaborators",
    status: "active",
  },
  {
    id: "6",
    startup_name: "PayPulse",
    founder_name: "Elena Rostova",
    founder_email: "elena@paypulse.fin",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80",
    industry: "FinTech",
    description:
      "Cross-border instant payroll solution designed specifically for global remote engineering teams.",
    funding_stage: "Series A",
    team_size_needed: "2 Collaborators",
    status: "active",
  },
  {
    id: "7",
    startup_name: "HealthSphere",
    founder_name: "Dr. Marcus Vance",
    founder_email: "marcus@healthsphere.med",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    industry: "HealthTech",
    description:
      "AI-assisted remote patient monitoring platform designed for post-surgery recovery tracking.",
    funding_stage: "Seed",
    team_size_needed: "4 Collaborators",
    status: "active",
  },
];

const FeaturedStartups = () => {
  // Simulating server-side filter for active featured startups
  const startups = FEATURED_STARTUPS.filter((item) => item.status === "active");

  return (
    <section className="bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            Active Recruitment
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Featured Startups
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Explore high-potential startup projects looking for developers,
            designers, and growth specialists to join their core teams.
          </p>
        </div>

        {/* Startup Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {startups.map((startup) => (
            <div
              key={startup.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
            >
              <div>
                {/* Header: Logo, Industry & Funding Stage */}
                <div className="flex items-start justify-between gap-4">
                  <img
                    src={startup.logo}
                    alt={`${startup.startup_name} Logo`}
                    className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                  />
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {startup.funding_stage}
                  </span>
                </div>

                {/* Startup & Founder Info */}
                <div className="mt-5">
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                    {startup.startup_name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Founded by{" "}
                    <span className="text-slate-700 dark:text-slate-200">
                      {startup.founder_name}
                    </span>
                  </p>
                </div>

                {/* Industry Tag */}
                <div className="mt-3">
                  <span className="inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    {startup.industry}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                  {startup.description}
                </p>
              </div>

              {/* Card Footer: Team Size & Apply Action */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Team Needed
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {startup.team_size_needed}
                    </p>
                  </div>

                  <Link
                    href={`/startups/${startup.id}`}
                    className="rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/startups"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Browse All Active Ideas →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStartups;
