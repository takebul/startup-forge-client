import { getUserSession } from "@/lib/core/session";
import ManageOpportunities from "./ManageOpportunities";
import { getOpportunitiesByUserId } from "@/lib/api/opportunities";

export const metadata = {
  title: "Manage Opportunities — StartupForge Founder Dashboard",
  description:
    "Edit, delete, and monitor engagement across all collaborative roles posted for your startup.",
};

const ManageOpportunitiesPage = async () => {
  const user = await getUserSession();
  const opportunities = await getOpportunitiesByUserId(user?.id);

  return (
    <div>
      <ManageOpportunities founderOpportunities={opportunities} />
    </div>
  );
};

export default ManageOpportunitiesPage;

