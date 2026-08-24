import { getUsersData } from "@/lib/api/users";
import AdminDashboardOverviewPage from "./AdminDashboardOverviewPage";
import { getStartups } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import { getSubscriptions } from "@/lib/api/subscriptions";

export const metadata = {
  title: "Admin Overview — StartupForge Control Panel",
  description:
    "System-wide administration metrics, user management, startup approval pipeline, and platform transaction analytics.",
};

const AdminDashboardOverviewPageWrapper = async () => {
  const userData = await getUsersData();
  const startups = await getStartups();
  const opportunities = await getOpportunities();
  const subscriptions = await getSubscriptions();

  return (
    <div>
      <AdminDashboardOverviewPage
        userData={userData}
        startups={startups}
        opportunities={opportunities}
        subscriptions={subscriptions}
      />
    </div>
  );
};

export default AdminDashboardOverviewPageWrapper;

