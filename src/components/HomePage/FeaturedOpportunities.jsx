import Link from "next/link";

const FEATURED_OPPORTUNITIES = [
  {
    id: "opp-1",
    startup_id: "start-101",
    startup_name: "NexusAI",
    role_title: "Senior Full Stack Engineer",
    required_skills: ["React", "Node.js", "Tailwind CSS", "PostgreSQL"],
    work_type: "Remote",
    commitment_level: "Part-Time (15 hrs/wk)",
    deadline: "2026-08-15",
  },
  {
    id: "opp-2",
    startup_id: "start-102",
    startup_name: "EcoGrid",
    role_title: "Lead UI/UX Designer",
    required_skills: [
      "Figma",
      "Design Systems",
      "Prototyping",
      "User Research",
    ],
    work_type: "Hybrid",
    commitment_level: "Full-Time",
    deadline: "2026-08-10",
  },
  {
    id: "opp-3",
    startup_id: "start-103",
    startup_name: "PayPulse",
    role_title: "Growth & Digital Marketer",
    required_skills: [
      "SEO",
      "Content Strategy",
      "Google Analytics",
      "Social Media",
    ],
    work_type: "Remote",
    commitment_level: "Part-Time (10 hrs/wk)",
    deadline: "2026-08-20",
  },
  {
    id: "opp-4",
    startup_id: "start-104",
    startup_name: "HealthSphere",
    role_title: "AI/ML Backend Developer",
    required_skills: ["Python", "FastAPI", "PyTorch", "Docker"],
    work_type: "Remote",
    commitment_level: "Co-Founder Level",
    deadline: "2026-08-05",
  },
  {
    id: "opp-5",
    startup_id: "start-105",
    startup_name: "FinEdge",
    role_title: "Financial Analyst",
    required_skills: ["Excel", "Financial Modeling", "Data Analysis"],
    work_type: "On-site",
    commitment_level: "Full-Time",
    deadline: "2026-08-25",
  },
  {
    id: "opp-6",
    startup_id: "start-106",
    startup_name: "GreenTech Solutions",
    role_title: "Sustainability Consultant",
    required_skills: [
      "Environmental Science",
      "Life Cycle Assessment",
      "Carbon Footprint Analysis",
    ],
    work_type: "Remote",
    commitment_level: "Part-Time (20 hrs/wk)",
    deadline: "2026-08-30",
  },
  {
    id: "opp-7",
    startup_id: "start-107",
    startup_name: "MedTech Innovations",
    role_title: "Medical Device Engineer",
    required_skills: [
      "Biomedical Engineering",
      "CAD Software",
      "Regulatory Affairs",
    ],
    work_type: "On-site",
    commitment_level: "Full-Time",
    deadline: "2026-08-15",
  },
  {
    id: "opp-8",
    startup_id: "start-108",
    startup_name: "AgriTech Solutions",
    role_title: "Agricultural Data Scientist",
    required_skills: ["Python", "Machine Learning", "Remote Sensing", "GIS"],
    work_type: "Remote",
    commitment_level: "Part-Time (15 hrs/wk)",
    deadline: "2026-08-20",
  },
];

// Helper function to format readable dates
const formatDate = (dateString) => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const FeaturedOpportunities = () => {
  return (
    <section className="bg-white py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            Open Roles
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Featured Opportunities
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Find your next collaborative role. Join early-stage teams as a
            developer, designer, or marketer and build groundbreaking projects
            together.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_OPPORTUNITIES.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-violet-500/50"
            >
              <div>
                {/* Header Tags: Work Type & Commitment */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {item.work_type}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {item.commitment_level}
                  </span>
                </div>

                {/* Role Title & Startup Name */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                    {item.role_title}
                  </h3>
                  <Link
                    href={`/startup/${item.startup_id}`}
                    className="inline-block text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400"
                  >
                    @{item.startup_name}
                  </Link>
                </div>

                {/* Required Skills Badges */}
                <div className="mt-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Required Skills
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Application Deadline & Action */}
              <div className="mt-6 border-t border-slate-200/80 pt-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Apply By
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatDate(item.deadline)}
                    </p>
                  </div>

                  <Link
                    href={`/opportunity/${item.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                  >
                    <span>Apply Now</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Opportunities Button */}
        <div className="mt-12 text-center">
          <Link
            href="/explore?tab=opportunities"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Explore All Opportunities →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
