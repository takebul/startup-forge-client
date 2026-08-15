import OpportunitiesPage from "@/components/Opportunities/OpportunitiesPage";
import { getOpportunities } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startups";

const OpportunitiesPageWrapper = async () => {
  const opportunities = await getOpportunities();
  const startups = await getStartups();
  return (
    <div>
      <OpportunitiesPage opportunities={opportunities} startups={startups} />
    </div>
  );
};

export default OpportunitiesPageWrapper;
