import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// -----------------------------------------------------------------------------
// 1. GUEST BANNER
// -----------------------------------------------------------------------------
const GuestBanner = () => (
  <section className="relative overflow-hidden bg-white py-20 transition-colors duration-200 dark:bg-[#0c0c16] lg:py-28">
    {/* Ambient glow */}
    <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/15" />

    <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-12">
      {/* Badge */}
      <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
        500+ active startups recruiting now
      </span>

      {/* Heading */}
      <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[52px]">
        Build Great Startups
        <br />
        <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-300 dark:to-indigo-400">
          Together on StartupForge
        </span>
      </h1>

      <p className="mt-5 text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
        The bridge between visionary founders and world-class collaborators.
        Publish your startup idea or join an ambitious team today.
      </p>

      {/* CTAs */}
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/register?role=founder"
          className="rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-violet-600 dark:hover:opacity-90"
        >
          Post your startup idea
        </Link>
        <Link
          href="/explore"
          className="rounded-xl border border-slate-200 bg-slate-50 px-7 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-violet-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:bg-slate-800"
        >
          Explore open roles →
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-4">
        {[
          { num: "500+", label: "Active Startups" },
          { num: "2,400+", label: "Collaborators" },
          { num: "1,100+", label: "Roles Filled" },
          { num: "98%", label: "Match Rate" },
        ].map(({ num, label }) => (
          <div
            key={label}
            className="bg-white px-4 py-5 text-center dark:bg-[#0c0c16]"
          >
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {num}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// 2. FOUNDER BANNER
// -----------------------------------------------------------------------------
const FounderBanner = ({ user }) => (
  <section className="bg-slate-50 py-16 transition-colors duration-200 dark:bg-[#0c0c16]">
    <div className="mx-auto max-w-6xl px-6 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left: copy */}
        <div>
          <span className="inline-block rounded-md bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-1 dark:ring-inset dark:ring-indigo-500/20">
            Founder Workspace
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Welcome back,{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {user?.name || "Founder"}
            </span>
            !
            <br />
            <span className="text-slate-900 dark:text-white">
              Ready to build your dream team?
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            Post new team requirements, review incoming applications from
            developers, designers, and marketers, and accelerate your startup's
            journey.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/founder/post-role"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              + Post new requirement
            </Link>
            <Link
              href="/founder/applications"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
            >
              Review applications
            </Link>
          </div>
        </div>

        {/* Right: dashboard card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#1a1a2e]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Recruitment overview
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                label: "Pending applications",
                value: "5 New",
                valueClass:
                  "rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
              },
              {
                label: "Active startup listings",
                value: "2 Active",
                valueClass:
                  "text-sm font-semibold text-slate-900 dark:text-white",
              },
              {
                label: "Open team roles",
                value: "4 Positions",
                valueClass:
                  "text-sm font-semibold text-slate-900 dark:text-white",
              },
            ].map(({ label, value, valueClass }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {label}
                </span>
                <span className={valueClass}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// 3. COLLABORATOR BANNER
// -----------------------------------------------------------------------------
const CollaboratorBanner = ({ user }) => (
  <section className="bg-slate-50 py-16 transition-colors duration-200 dark:bg-[#0c0c16]">
    <div className="mx-auto max-w-6xl px-6 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left: copy */}
        <div>
          <span className="inline-block rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-500/20">
            Collaborator Hub
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Welcome back,{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              {user?.name || "Collaborator"}
            </span>
            !
            <br />
            <span className="text-slate-900 dark:text-white">
              Discover your next big project.
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
            Explore early-stage startup ideas, filter open positions by tech
            stack or role type, and track your application status in real time.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Explore startups
            </Link>
            <Link
              href="/collaborator/my-applications"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-slate-800"
            >
              Track my applications
            </Link>
          </div>
        </div>

        {/* Right: activity card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#1a1a2e]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Your activity
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                label: "Active applications",
                value: "3 Pending",
                valueClass:
                  "rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
              },
              {
                label: "Profile completeness",
                value: "85% complete",
                valueClass:
                  "text-sm font-semibold text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Team invites",
                value: "1 New invite",
                valueClass:
                  "text-sm font-semibold text-slate-900 dark:text-white",
              },
            ].map(({ label, value, valueClass }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {label}
                </span>
                <span className={valueClass}>{value}</span>
              </div>
            ))}
          </div>

          {/* Profile progress bar */}
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Profile strength
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                85%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: "85%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// 4. ADMIN BANNER
// -----------------------------------------------------------------------------
const AdminBanner = ({ user }) => (
  <section className="border-b border-slate-200 bg-slate-100 py-12 transition-colors duration-200 dark:border-slate-800 dark:bg-[#0c0c16]">
    <div className="mx-auto max-w-6xl px-6 lg:px-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
            Admin Console
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            System administration &amp; platform health
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Manage user accounts, review flagged startup pitches, and monitor
            platform activity.
          </p>
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Manage users
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-rose-500 dark:hover:bg-slate-800"
          >
            Moderate posts
          </Link>
        </div>
      </div>

      {/* Quick stat chips */}
      <div className="mt-8 flex flex-wrap gap-3">
        {[
          { label: "Total users", value: "3,412" },
          { label: "Active startups", value: "502" },
          { label: "Flagged posts", value: "7", alert: true },
          { label: "Open roles", value: "1,140" },
        ].map(({ label, value, alert }) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
              alert
                ? "border-rose-200 bg-rose-50 dark:border-rose-500/25 dark:bg-rose-500/10"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <span
              className={`text-xs ${
                alert
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {label}
            </span>
            <span
              className={`text-sm font-bold ${
                alert
                  ? "text-rose-700 dark:text-rose-300"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
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

  if (!session) return <GuestBanner />;

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
