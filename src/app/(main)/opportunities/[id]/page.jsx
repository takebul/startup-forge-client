import { getOpportunityDetails } from "@/lib/api/opportunities";
import OpportunityDetailsPage from "./OpportunityDetailsPage";
import { getStartups } from "@/lib/api/startups";
import { getUsersData } from "@/lib/api/users";
import { getApplicationsById } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";

const OpportunityDetailsPageWrapper = async ({ params }) => {
  const { id } = await params;

  // 1. Fetch user session, opportunity details, startups, and users data in parallel
  const [user, opportunity, startups, userData] = await Promise.all([
    getUserSession(),
    getOpportunityDetails(id),
    getStartups(),
    getUsersData(),
  ]);

  // 2. Fetch logged-in collaborator's submitted applications to check if already applied
  const userApplications = user?.id ? await getApplicationsById(user.id) : [];

  const initialAppliedOppIds = Array.isArray(userApplications)
    ? userApplications
        .map((app) =>
          String(app.opportunityId || app.convertedOppId || app._id),
        )
        .filter(Boolean)
    : [];

  return (
    <div>
      <OpportunityDetailsPage
        opportunity={opportunity}
        startups={startups}
        userData={userData}
        initialAppliedOppIds={initialAppliedOppIds}
      />
    </div>
  );
};

export default OpportunityDetailsPageWrapper;
