import { getOpportunitiesByUserId } from "@/lib/api/opportunities";
import FounderDashboardOverviewPage from "./FounderDashboardOverviewPage";
import { getUserSession } from "@/lib/core/session";
import { getApplicationsByStartupId } from "@/lib/api/applications";

export const metadata = {
  title: "Founder Overview — StartupForge Dashboard",
  description:
    "Review open opportunity metrics, applications received, and team recruitment performance.",
};

const FounderDashboardOverviewPageWrapper = async () => {
  const user = await getUserSession();
  const opportunities = await getOpportunitiesByUserId(user?.id);
  const applications = await getApplicationsByStartupId(user?.id);

  return (
    <div>
      <FounderDashboardOverviewPage
        user={user}
        opportunities={opportunities}
        applications={applications}
      />
    </div>
  );
};

export default FounderDashboardOverviewPageWrapper;

