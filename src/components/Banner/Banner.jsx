import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// -----------------------------------------------------------------------------
// 1. GUEST BANNER (Light & Dark Mode Supported)
// -----------------------------------------------------------------------------
const GuestBanner = () => (
  <section className="relative overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 py-20 lg:py-28">
    {/* Background Glow Effect */}
    <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-violet-500/10 dark:bg-violet-600/20 blur-3xl" />

    <div className="container mx-auto px-6 text-center lg:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="inline-block rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 transition-colors dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
          Where Ideas Meet Talent
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
          Build Great Startups <br />
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-300 dark:to-indigo-400">
            Together on StartupForge
          </span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
          The bridge between visionary founders and world-class collaborators.
          Publish your startup idea or join an ambitious team today.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/register?role=founder"
            className="rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 dark:shadow-violet-600/30 dark:hover:bg-violet-500"
          >
            Post Your Startup Idea
          </Link>
          <Link
            href="/explore"
            className="rounded-xl border border-slate-300 bg-slate-50 px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Explore Open Roles
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-10 dark:border-slate-800/80 sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              500+
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Startups
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              2,400+
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Collaborators
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              1,100+
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Roles Filled
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              98%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Match Rate
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// 2. FOUNDER BANNER (Light & Dark Mode Supported)
// -----------------------------------------------------------------------------
const FounderBanner = ({ user }) => (
  <section className="bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-900 dark:text-slate-100">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-block rounded-md bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-1 dark:ring-inset dark:ring-indigo-500/20">
            Founder Workspace
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Welcome back, {user?.name || "Founder"}! <br />
            <span className="text-indigo-600 dark:text-indigo-400">
              Ready to build your dream team?
            </span>
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Post new team requirements, review incoming applications from
            developers, designers, and marketers, and accelerate your startup's
            journey.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/founder/post-role"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 dark:hover:bg-indigo-500"
            >
              + Post New Requirement
            </Link>
            <Link
              href="/founder/applications"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Review Applications
            </Link>
          </div>
        </div>

        {/* Dashboard Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950/60 backdrop-blur-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recruitment Overview
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Pending Applications
              </span>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                5 New
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Active Startup Listings
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                2 Active
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Open Team Roles
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                4 Positions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// 3. COLLABORATOR BANNER (Light & Dark Mode Supported)
// -----------------------------------------------------------------------------
const CollaboratorBanner = ({ user }) => (
  <section className="bg-slate-50 py-16 text-slate-900 transition-colors duration-200 dark:bg-slate-900 dark:text-slate-100">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-block rounded-md bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-500/20">
            Collaborator Hub
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Welcome back, {user?.name || "Collaborator"}! <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              Discover your next big project.
            </span>
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Explore early-stage startup ideas, filter open positions by tech
            stack or role type, and track your application status in real-time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/explore"
              className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-emerald-700 dark:hover:bg-emerald-500"
            >
              Explore Startups
            </Link>
            <Link
              href="/collaborator/my-applications"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Track My Applications
            </Link>
          </div>
        </div>

        {/* Quick Status Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950/60 backdrop-blur-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Your Activity
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Active Applications
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                3 Pending
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Profile Completeness
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                85% Complete
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Team Invites
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                1 New Invite
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// 4. ADMIN BANNER (Light & Dark Mode Supported)
// -----------------------------------------------------------------------------
const AdminBanner = ({ user }) => (
  <section className="bg-slate-100 border-b border-slate-200 py-12 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <span className="rounded bg-rose-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
            Admin Console
          </span>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            System Administration & Platform Health
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage user accounts, review flagged startup pitches, and monitor
            platform activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-rose-700 dark:hover:bg-rose-500"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Moderate Posts
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// MAIN SERVER COMPONENT
// -----------------------------------------------------------------------------
const BannerPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role;

  console.log("User:", user);
  console.log("Role:", role);

  if (!session) {
    return <GuestBanner />;
  }

  switch (role) {
    case "admin":
      return <AdminBanner user={user} />;
    case "founder":
      return <FounderBanner user={user} />;
    case "collaborator":
      return <CollaboratorBanner user={user} />;
    default:
      return <GuestBanner />;
  }
};

export default BannerPage;
