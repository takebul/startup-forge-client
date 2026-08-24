import { getApplicationsByStartupId } from "@/lib/api/applications";
import FounderApplicationsPage from "./FounderApplicationsPage";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Applicant Review — StartupForge Founder Dashboard",
  description:
    "Review candidate applications, evaluate pitch decks and GitHub profiles, and accept or decline potential team members.",
};

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

