import AddOpportunity from "./AddOpportunity";
import { getUserSession } from "@/lib/core/session";
import { getPlansById } from "@/lib/api/plans";
import { getOpportunitiesByUserId } from "@/lib/api/opportunities";

const AddOpportunityPage = async () => {
  const user = await getUserSession();
  const startupData = await getOpportunitiesByUserId(user?.id);
  const plans = await getPlansById(user?.plan || "founder_free");

  return (
    <div>
      <AddOpportunity opportunities={startupData} plans={plans} />
    </div>
  );
};

export default AddOpportunityPage;
