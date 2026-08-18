import OpportunitiesPage from "@/components/Opportunities/OpportunitiesPage";
import { getOpportunities } from "@/lib/api/opportunities";
import { getStartups } from "@/lib/api/startups";

const OpportunitiesPageWrapper = async ({ searchParams }) => {
  const searchQuery = await searchParams;
  const page = searchQuery.page || 1;
  const limit = searchQuery.limit || 9;

  const opportunities = await getOpportunities(page, limit);
  const { total_data } = opportunities;
  console.log(total_data);
  const startups = await getStartups();
  return (
    <div>
      <OpportunitiesPage
        opportunities={opportunities}
        startups={startups}
        currentPage={page}
        pageSize={limit}
        totalData={total_data}
      />
    </div>
  );
};

export default OpportunitiesPageWrapper;
