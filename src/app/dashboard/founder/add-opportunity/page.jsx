import { getFounderStartup } from "@/lib/api/startups";
import AddOpportunity from "./AddOpportunity";
import { getUserSession } from "@/lib/core/session";

const AddOpportunityPage = async () => {
  const user = await getUserSession();
  const startupData = await getFounderStartup(user?.id);

  return (
    <div>
      <AddOpportunity startup={startupData} />
    </div>
  );
};

export default AddOpportunityPage;
