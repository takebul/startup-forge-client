import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { getSubscriptions } from "@/lib/api/subscriptions";
import { getFounderStartup, getStartups } from "@/lib/api/startups";
import { getApplicationsById } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";

export default async function DashboardLayout({ children }) {
  const user = await getUserSession();
  const subscriptions = await getSubscriptions();
  const startups = await getStartups();
  const founderStartups = await getFounderStartup(user?.id);
  const applications = await getApplicationsById(user?.id);

  console.log({ subscriptions, startups, founderStartups, applications });
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0C10] font-sans text-slate-300">
      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col border-r border-[#1E212B] bg-[#0F111A]">
        {/* Logo */}
        <DashboardSidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        {/* Top Header */}
        <DashboardNavbar
          subscriptions={subscriptions}
          startups={startups}
          applications={applications}
          founderStartups={founderStartups}
          user={user}
        />

        {/* Scrollable Children Container */}
        <main className="flex-1 overflow-y-auto bg-[#0A0C10] px-8 pb-8">
          <div className="min-h-full py-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
