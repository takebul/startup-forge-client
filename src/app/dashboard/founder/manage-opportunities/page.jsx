import { getUserSession } from "@/lib/core/session";
import ManageOpportunities from "./ManageOpportunities";
import { getOpportunitiesByUserId } from "@/lib/api/opportunities";

const ManageOpportunitiesPage = async () => {
  const user = await getUserSession();
  const opportunities = await getOpportunitiesByUserId(user?.id);

  console.log(opportunities);
  return (
    <div>
      <ManageOpportunities founderOpportunities={opportunities} />
    </div>
  );
};

export default ManageOpportunitiesPage;
