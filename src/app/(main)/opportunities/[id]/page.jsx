import { getOpportunityDetails } from "@/lib/api/opportunities";
import OpportunityDetailsPage from "./OpportunityDetailsPage";
import { getStartups } from "@/lib/api/startups";
import { getUsersData } from "@/lib/api/users";

const OpportunityDetailsPageWrapper = async ({ params }) => {
  const { id } = await params;
  const opportunity = await getOpportunityDetails(id);
  const startups = await getStartups();
  const userData = await getUsersData();

  console.log({ opportunity, startups, userData });

  return (
    <div>
      <OpportunityDetailsPage
        opportunity={opportunity}
        startups={startups}
        userData={userData}
      />
    </div>
  );
};

export default OpportunityDetailsPageWrapper;
