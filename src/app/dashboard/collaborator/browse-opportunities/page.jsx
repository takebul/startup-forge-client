import { getOpportunities } from "@/lib/api/opportunities";
import BrowseOpportunities from "./BrowseOpportunities";
import { getUserSession } from "@/lib/core/session";

const BrowseOpportunitiesPage = async () => {
  const opportunities = await getOpportunities();
  const user = await getUserSession();
  console.log(user?.id);
  return (
    <div>
      <BrowseOpportunities
        opportunitiesData={opportunities}
        opportunityId={user?.id}
      />
    </div>
  );
};

export default BrowseOpportunitiesPage;
