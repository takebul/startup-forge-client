"use client";

import {
  Rocket,
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Info,
  Check,
  X,
  Eye,
  Plus,
  Bell,
} from "lucide-react";

export default function DashboardHomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Active
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">3</h2>
            <p className="mt-1 text-sm text-slate-400">Published Startups</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+1 this month</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <FileText className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              Pending
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">18</h2>
            <p className="mt-1 text-sm text-slate-400">Total Applications</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            <span>7 need review</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Users className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
              Team
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">6</h2>
            <p className="mt-1 text-sm text-slate-400">Accepted Members</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-indigo-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+2 this week</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#12141D] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Open
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-white">9</h2>
            <p className="mt-1 text-sm text-slate-400">Open Roles</p>
          </div>
          <div className="mt-4 flex items-center space-x-1.5 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5" />
            <span>3 with applicants</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          MIDDLE SECTION: CHART & STARTUPS LIST
      ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* CHART (Left - 2 Cols) */}
        <div className="col-span-2 flex flex-col rounded-xl border border-[#1E212B] bg-[#12141D] p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Application Activity
              </h3>
              <p className="text-xs text-slate-500">
                Inbound applications over the last 8 weeks
              </p>
            </div>
            <button className="rounded-md border border-[#232634] bg-[#151722] px-3 py-1.5 text-[11px] font-semibold text-slate-300">
              Last 8 Weeks
            </button>
          </div>

          {/* SVG Line Chart Mock to match image exactly */}
          <div className="relative mt-8 h-48 w-full">
            {/* Y-Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
              {[10, 5, 0].map((val) => (
                <div key={val} className="flex items-center w-full">
                  <span className="w-6 text-[10px] text-slate-600">{val}</span>
                  <div className="h-px w-full bg-[#1E212B]" />
                </div>
              ))}
            </div>
            {/* Chart SVG */}
            <svg
              className="absolute inset-0 h-full w-full pt-2 pb-6 pl-8"
              preserveAspectRatio="none"
              viewBox="0 0 800 120"
            >
              {/* NexusAI Line (Purple) */}
              <polyline
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                points="0,90 100,70 200,90 300,50 400,70 500,20 600,60 700,40"
              />
              <circle cx="0" cy="90" r="3" fill="#8B5CF6" />
              <circle cx="100" cy="70" r="3" fill="#8B5CF6" />
              <circle cx="200" cy="90" r="3" fill="#8B5CF6" />
              <circle cx="300" cy="50" r="3" fill="#8B5CF6" />
              <circle cx="400" cy="70" r="3" fill="#8B5CF6" />
              <circle cx="500" cy="20" r="3" fill="#8B5CF6" />
              <circle cx="600" cy="60" r="3" fill="#8B5CF6" />
              <circle cx="700" cy="40" r="3" fill="#8B5CF6" />

              {/* HealthSphere Line (Teal) */}
              <polyline
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2.5"
                points="0,110 100,100 200,80 300,90 400,60 500,90 600,60 700,30"
              />
              <circle cx="0" cy="110" r="3" fill="#2DD4BF" />
              <circle cx="100" cy="100" r="3" fill="#2DD4BF" />
              <circle cx="200" cy="80" r="3" fill="#2DD4BF" />
              <circle cx="300" cy="90" r="3" fill="#2DD4BF" />
              <circle cx="400" cy="60" r="3" fill="#2DD4BF" />
              <circle cx="500" cy="90" r="3" fill="#2DD4BF" />
              <circle cx="600" cy="60" r="3" fill="#2DD4BF" />
              <circle cx="700" cy="30" r="3" fill="#2DD4BF" />
            </svg>
            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-slate-600">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Week 5</span>
              <span>Week 6</span>
              <span>Week 7</span>
              <span>Week 8</span>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-4 flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-6 rounded bg-[#8B5CF6]" />
              <span>NexusAI</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-6 rounded bg-[#2DD4BF]" />
              <span>HealthSphere</span>
            </div>
          </div>
        </div>

        {/* MY STARTUPS (Right - 1 Col) */}
        <div className="flex flex-col rounded-xl border border-[#1E212B] bg-[#12141D] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-bold text-white">My Startups</h3>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All →
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {[
              {
                letter: "N",
                bg: "bg-indigo-600",
                name: "NexusAI",
                detail: "3 roles • 7 applicants",
                status: "Live",
                statColor:
                  "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
              },
              {
                letter: "H",
                bg: "bg-rose-600",
                name: "HealthSphere",
                detail: "5 roles • 9 applicants",
                status: "Live",
                statColor:
                  "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
              },
              {
                letter: "F",
                bg: "bg-amber-600",
                name: "FarmLink",
                detail: "1 role • 2 applicants",
                status: "Draft",
                statColor: "text-amber-400 border-amber-500/20 bg-amber-500/10",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-[#1E212B] bg-[#151722] p-3"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg} text-sm font-bold text-white`}
                  >
                    {item.letter}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{item.detail}</p>
                  </div>
                </div>
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] font-bold ${item.statColor}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-4 flex w-full items-center justify-center space-x-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            <span>Create New Startup</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          RECENT APPLICATIONS TABLE
      ------------------------------------------------------------------------- */}
      <div className="overflow-hidden rounded-xl border border-[#1E212B] bg-[#12141D] shadow-sm">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Recent Applications
            </h3>
            <p className="text-xs text-slate-500">
              Review and respond to candidates
            </p>
          </div>
          <button className="rounded-md border border-[#232634] bg-[#151722] px-4 py-1.5 text-xs font-semibold text-slate-300">
            View All
          </button>
        </div>

        <div className="w-full overflow-x-auto px-6 pb-6">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-[#1E212B] text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-3 pr-4">Applicant</th>
                <th className="pb-3 px-4">Role</th>
                <th className="pb-3 px-4">Startup</th>
                <th className="pb-3 px-4">Applied</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E212B]">
              {[
                {
                  name: "James Obi",
                  role: "Full-Stack Dev",
                  job: "Full-Stack Developer",
                  startup: "NexusAI",
                  startupColor: "text-indigo-400",
                  time: "2 days ago",
                  status: "Pending",
                  sColor: "text-amber-400 bg-amber-500/10",
                  avatar:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                },
                {
                  name: "Sarah Kim",
                  role: "UI/UX Designer",
                  job: "Lead Product Designer",
                  startup: "HealthSphere",
                  startupColor: "text-rose-400",
                  time: "1 day ago",
                  status: "Accepted",
                  sColor: "text-emerald-400 bg-emerald-500/10",
                  avatar:
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                },
                {
                  name: "Marcus Chen",
                  role: "ML Engineer",
                  job: "AI/ML Engineer",
                  startup: "NexusAI",
                  startupColor: "text-indigo-400",
                  time: "Today",
                  status: "Pending",
                  sColor: "text-amber-400 bg-amber-500/10",
                  avatar:
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
                },
                {
                  name: "Amara Nwosu",
                  role: "Marketer",
                  job: "Growth & Marketing Lead",
                  startup: "FarmLink",
                  startupColor: "text-amber-400",
                  time: "3 days ago",
                  status: "Rejected",
                  sColor: "text-rose-400 bg-rose-500/10",
                  avatar:
                    "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=100&auto=format&fit=crop&q=80",
                },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={row.avatar}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">
                          {row.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{row.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium">{row.job}</td>
                  <td className={`px-4 py-4 font-bold ${row.startupColor}`}>
                    {row.startup}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {row.time}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded border border-transparent px-2 py-0.5 text-[10px] font-bold ${row.sColor}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-6 w-6 items-center justify-center rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-6 w-6 items-center justify-center rounded bg-slate-500/10 text-slate-400 hover:bg-slate-500/20">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          OPEN TEAM ROLES
      ------------------------------------------------------------------------- */}
      <div className="rounded-xl border border-[#1E212B] bg-[#12141D] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h3 className="text-base font-bold text-white">Open Team Roles</h3>
            <p className="text-xs text-slate-500">
              Manage active role listings across your startups
            </p>
          </div>
          <button className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Role</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Full-Stack Developer",
              startup: "NexusAI",
              skills: ["React", "Node.js"],
              apps: "4 applicants",
              type: "Remote • PT",
            },
            {
              title: "AI/ML Engineer",
              startup: "NexusAI",
              skills: ["Python", "PyTorch"],
              apps: "3 applicants",
              type: "Remote • Co-Founder",
            },
            {
              title: "Lead Product Designer",
              startup: "HealthSphere",
              skills: ["Figma", "UX Research"],
              apps: "5 applicants",
              type: "Hybrid • FT",
            },
          ].map((role, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-[#1E212B] bg-[#151722] p-5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {role.title}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {role.startup}
                    </p>
                  </div>
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                    Open
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-[#1E212B] px-2 py-1 text-[10px] font-medium text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#1E212B] pt-4">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{role.apps}</span>
                </div>
                <span className="text-[10px] text-slate-500">{role.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
