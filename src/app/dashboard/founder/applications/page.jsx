import { getApplicationsByStartupId } from "@/lib/api/applications";
import FounderApplicationsPage from "./FounderApplicationsPage";
import { getUserSession } from "@/lib/core/session";

const FounderApplicationsPageWrapper = async () => {
  const user = await getUserSession();
  const founderApplications = await getApplicationsByStartupId(user?.id);

  return (
    <div>
      <FounderApplicationsPage founderApplications={founderApplications} />
    </div>
  );
};

export default FounderApplicationsPageWrapper;
