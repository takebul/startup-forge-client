import { authClient } from "@/lib/auth-client";
import { Bell, Plus } from "lucide-react";

const DashboardNavbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
      <header className="flex flex-col border-b border-[#1E212B] bg-[#0F111A] gap-4 px-8 pt-8 pb-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {capitalizeFirstLetter(user?.role)} Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back, {user?.name} 👋 — Here's your startup overview
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex h-10 items-center justify-center space-x-2 rounded-lg bg-[#151722] px-4 text-sm font-semibold text-slate-300 border border-[#232634] hover:bg-[#1E2130]">
            <Bell className="h-4 w-4" />
            <span>3</span>
          </button>
          <button className="flex h-10 items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            <span>New Startup</span>
          </button>
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/50"
          />
        </div>
      </header>
    </div>
  );
};

export default DashboardNavbar;
