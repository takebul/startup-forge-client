import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { getUserSession, requireAccountType } from "@/lib/core/session";

export default async function DashboardLayout({ children }) {
  const user = await getUserSession();
  await requireAccountType(user?.accountType);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
        <DashboardSidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        {/* Top Header */}
        <DashboardNavbar user={user} />

        {/* Scrollable Children Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 sm:px-8 pb-8 transition-colors duration-200 dark:bg-slate-950">
          <div className="min-h-full py-4">{children}</div>
        </main>
      </div>
    </div>
  );
}

