"use client";

import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";

export default function DashboardLayout({ children }) {
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
        <DashboardNavbar />

        {/* Scrollable Children Container */}
        <main className="flex-1 overflow-y-auto bg-[#0A0C10] px-8 pb-8">
          <div className="min-h-full py-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
