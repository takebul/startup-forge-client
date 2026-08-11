import { getOpportunitiesByUserId } from "@/lib/api/opportunities";
import FounderDashboardOverviewPage from "./FounderDashboardOverviewPage";
import { getUserSession } from "@/lib/core/session";
import { getApplicationsByStartupId } from "@/lib/api/applications";

const FounderDashboardOverviewPageWrapper = async () => {
  const user = await getUserSession();
  const opportunities = await getOpportunitiesByUserId(user?.id);
  const applications = await getApplicationsByStartupId(user?.id);

  console.log({ opportunities, applications });
  return (
    <div>
      <FounderDashboardOverviewPage
        opportunities={opportunities}
        applications={applications}
      />
    </div>
  );
};

export default FounderDashboardOverviewPageWrapper;
