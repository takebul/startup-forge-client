import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import { getUserSession, requireAccountType } from "@/lib/core/session";

export default async function DashboardLayout({ children }) {
  const user = await getUserSession();
  await requireAccountType(user?.accountType);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* DESKTOP SIDEBAR (Visible on lg: and above) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-[#080E1C]">
        <DashboardSidebar initialUser={user} />
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-1 flex-col overflow-hidden w-full min-w-0">
        {/* Top Header & Mobile/Tablet Navigation Trigger */}
        <DashboardNavbar initialUser={user} />

        {/* Scrollable Children Content Container with Mobile/Tablet Bottom Bar Clearance */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 px-3.5 sm:px-6 lg:px-8 pb-24 lg:pb-8 transition-colors duration-200 dark:bg-slate-950">
          <div className="min-h-full py-4 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
