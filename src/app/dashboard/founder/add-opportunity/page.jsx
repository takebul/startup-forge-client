import { getFounderStartups } from "@/lib/api/startups";
import AddOpportunity from "./AddOpportunity";
import { getUserSession } from "@/lib/core/session";

const AddOpportunityPage = async () => {
  const user = await getUserSession();
  const startup = await getFounderStartups(user?.id);

  return (
    <div>
      <AddOpportunity startup={startup[0]} />
    </div>
  );
};

export default AddOpportunityPage;
